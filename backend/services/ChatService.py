from backend.settings import OPEN_AI_SECRET_KEY
from openai import OpenAI
from openai.types.chat import ChatCompletion

MODEL = "gpt-3.5-turbo-0125"

SYSTEM_ROLE = "system"
USER_ROLE = "user"
ASSITANT_ROLE = "assistant"

ASSISTANT_PROMPT_TEMPLATE = "You are a coding expert for the language {0}. You are tutoring a student through a coding problem. You tend to give examples to help the student understand and will ask leading questions that prompt the student to think more in the right direction. You are concise when needed and verbose when needed. You do not expect the student to respond or have a conversation with you."
QUESTION_DESCRIPTION_TEMPLATE = "For context, here is the question: {0}"
USER_CURRENT_SOLUTION_TEMPLATE = "For context, here is my current solution: {0}"


OPEN_AI_CLIENT = OpenAI(api_key=OPEN_AI_SECRET_KEY)


class ChatService:
    def send_chat_with_no_context(
        self,
        question_description: str,
        user_query: str,
        user_coding_language: str,
        user_current_solution: str = "",
    ) -> str:
        completion: ChatCompletion = OPEN_AI_CLIENT.chat.completions.create(
            model=MODEL,
            messages=[
                {
                    "role": SYSTEM_ROLE,
                    "content": ASSISTANT_PROMPT_TEMPLATE.format(user_coding_language)
                },
                {
                    "role": USER_ROLE,
                    "content": QUESTION_DESCRIPTION_TEMPLATE.format(question_description)
                },
                {
                    "role": USER_ROLE,
                    "content": USER_CURRENT_SOLUTION_TEMPLATE.format(user_current_solution)
                },
                {
                    "role": USER_ROLE,
                    "content": user_query
                }
            ]
        )

        completion_response = completion.choices[0].message.content

        return completion_response if completion_response else ""

chat_service = ChatService()
