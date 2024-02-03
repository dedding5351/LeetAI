from flask import Blueprint, jsonify, request, make_response
from backend.services.ChatService import chat_service

blueprint = Blueprint('chat', __name__)

@blueprint.route("/query-no-context", methods=["POST"])
def chat_query_no_context():
    request_data = request.get_json()

    question_description = request_data.get('question_description')
    user_query = request_data.get('user_query')
    user_coding_language = request_data.get('user_coding_language')
    user_current_solution = request_data.get('user_current_solution')

    chat_response: str = chat_service.send_chat_with_no_context(
        question_description,
        user_query,
        user_coding_language,
        user_current_solution
    )

    response = make_response({"chat_resposne": chat_response})
    return response, 200
