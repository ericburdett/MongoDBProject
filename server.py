import flask
import pymongo
from bson.json_util import dumps, loads

HOST = '127.0.0.1'
WS_PORT = 5000
MONGO_PORT = 27018


def ws_create():
    ws = flask.Flask(__name__, static_url_path="", static_folder="static")
    mongo = pymongo.MongoClient(host=HOST, port=MONGO_PORT)

    @ws.route('/', redirect_to='/index.html')
    def root():
        pass

    @ws.route('/searchWords')
    def search_words():
        query = flask.request.args.get('q', '')
        cursor = mongo['dictionary']['collection']['words'].find({"word": {"$regex": "^" + query}}, {"_id": 0})
        cursor = cursor.sort("word")
        result = list(cursor.limit(20))
        json_data = dumps(result)

        return json_data, 200

    @ws.route('/addWord', methods=['POST'])
    def add_word():
        word = flask.request.form.get('word', '')
        lang = flask.request.form.get('language', '')

        result = mongo['dictionary']['collection']['words'].insert_one({"word": word, "lang": lang, "translations": []})
        if result.acknowledged:
            return '', 200
        else:
            return '', 400

    @ws.route('/deleteWord', methods=['DELETE'])
    def delete_word():
        word = flask.request.form.get('word', '')

        result = mongo['dictionary']['collection']['words'].delete_one({"word": word})
        if result.acknowledged:
            return '', 200
        else:
            return '', 400

    @ws.route('/addRelatedWord', methods=['POST'])
    def add_related_word():
        from_word = flask.request.form.get('from_word', '')
        to_word = flask.request.form.get('to_word', '')
        to_lang = flask.request.form.get('to_lang', '')

        print('from_word:', from_word)
        print('to_word:', to_word)
        print('to_lang:', to_lang)

        result = mongo['dictionary']['collection']['words'].update({'word': from_word}, {"$push": {"translations": {"word": to_word, "lang": to_lang}}})
        print(result)
        if result.get('nModified', 0):
            return '', 200
        else:
            return '', 400

    @ws.route('/deleteRelatedWord', methods=['DELETE'])
    def delete_related_word():
        from_word = flask.request.form.get('from_word', '')
        to_word = flask.request.form.get('to_word', '')

        print('from_word:', from_word)
        print('to_word:', to_word)

        result = mongo['dictionary']['collection']['words'].update({'word': from_word}, {"$pull": {"translations": {"word": to_word}}})
        print(result)
        if result.get('nModified', 0):
            return '', 200
        else:
            return '', 400

    return ws


if __name__ == '__main__':
    app = ws_create()
    app.run(host=HOST, port=WS_PORT)
