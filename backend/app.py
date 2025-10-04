from flask import Flask, request, jsonify

app = Flask(__name__)


@app.route('/api/pollution', methods=["GET"])
def getPollution():
    return jsonify({"longitude": "-73.989308", "latitude": "40.741895"}) # TODO implement


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8080)