import React, { useState, useRef, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import Message, { MessageType } from './Message';

// Declare chrome globally
declare const chrome: any;

const environment = process.env.NODE_ENV || 'production';

let apiUrl: string

if (environment == "development") {
  apiUrl = 'http://localhost:5000/chat/query-no-context'
} else {
  apiUrl = 'https://leetai-usaljehuua-ue.a.run.app/chat/query-no-context'
}

const MESSAGE_TYPES = {
  USER: 'userMessage',
};

const filterExpiredMessages = (messages: MessageType[]): MessageType[] => {
  const currentTime = new Date().getTime();
  return messages.filter((message) => currentTime - message.timestamp < 60 * 60 * 1000);
};

const saveChatHistory = (newMessage: MessageType) => {
  chrome.storage.local.get('chatHistory', (result: { chatHistory: MessageType[] }) => {
    const existingHistory = result.chatHistory || [];

    const updatedHistory = [...existingHistory, newMessage];
    const filteredHistory = filterExpiredMessages(updatedHistory);

    chrome.storage.local.set({ chatHistory: filteredHistory }, () => {
      if (chrome.runtime.lastError) {
        console.error('Error saving chat history:', chrome.runtime.lastError);
      } else {
        console.log('Chat history saved successfully.');
      }
    });
  });
};

const executeContentScript = () => {
  // Perform the action that triggers the content script
  console.log("Executing content script...");

  // Get the active tab
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs: any) => {
      const activeTab = tabs[0];

      // Inject content script code into the active tab
      chrome.scripting.executeScript({
          target: { tabId: activeTab.id },
          files: ['contentScript.js'],
      }, (_result: any) => {
          // Check the result for any errors
      });
  });
};

let globalUserInputMessage = '';

chrome.runtime.onMessage.addListener((request: any, _sender: any, _sendResponse: any) => {
  if (request.type === 'contentScriptResult') {
      chrome.runtime.sendMessage(
        { 
          type: 'makeApiRequest', 
          url: apiUrl, 
          questionDescription: request.content, 
          userLanguage: request.userLanguage, 
          currentSolution: request.currentSolution,
          userQuery: globalUserInputMessage
        },
        (response: any) => {
          console.log('Received response from background script:', response);
      }
    );
  }
});

const Chat = () => {
  const [inputMessage, setInputMessage] = useState<string>('');
  const [messages, setMessages] = useState<MessageType[]>([]);
  const messagesRef = useRef<HTMLDivElement>(null);
  const lastMessageTimeRef = useRef<number | null>(null);

  const sendMessage = () => {
    if (inputMessage.trim() !== '' ) {
      const currentTime = new Date().getTime();
      if (lastMessageTimeRef.current === null || currentTime - lastMessageTimeRef.current >= 5000) {
        const newMessage: MessageType = { id: uuidv4(), text: inputMessage, isUser: true, timestamp: currentTime };

        setMessages((prevMessages) => [...prevMessages, newMessage]);
        globalUserInputMessage = inputMessage
        setInputMessage('');
        lastMessageTimeRef.current = currentTime;
  
        if (typeof chrome !== 'undefined') {
          saveChatHistory(newMessage);
          executeContentScript();
        }
      } else {
        const newMessage: MessageType = { id: uuidv4(), text: "Please wait at least 5 seconds between messages.", isUser: false, timestamp: currentTime };

        setMessages((prevMessages) => [...prevMessages, newMessage]);
  
        if (typeof chrome !== 'undefined') {
          saveChatHistory(newMessage);
        }
      }
    }
  };

  const handleKeyUp = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      sendMessage();
    }
  };

  useEffect(() => {
    if (messagesRef.current) {
      messagesRef.current.scrollTop = messagesRef.current.scrollHeight;
    }
  }, [messages]);

  useEffect(() => {
    if (typeof chrome !== 'undefined') {
      chrome.storage.local.get('chatHistory', (result: { chatHistory: MessageType[] }) => {
        const existingHistory = result.chatHistory || [];
        const filteredHistory = filterExpiredMessages(existingHistory);
        setMessages(filteredHistory);
      });

      chrome.runtime.onMessage.addListener((request: { type: string; message: MessageType }, _sender: any, _sendResponse: any) => {
        if (request.type === MESSAGE_TYPES.USER) {
          const currentTime = new Date().getTime();
          const newMessage: MessageType = { 
            id: request.message.id, 
            text: request.message.text, 
            isUser: request.message.isUser, 
            timestamp: currentTime 
          };

          setMessages((prevMessages) => [...prevMessages, newMessage]);
          saveChatHistory(newMessage);
        }
      });
    }
  }, []);

  return (
    <div className="flex flex-col h-screen">
      <div className="flex-1 overflow-y-auto p-4" ref={messagesRef}>
        {messages.map((message) => (
          <Message key={message.id} message={message} />
        ))}
      </div>
      <div className="p-4 border-t border-gray-300">
        <input
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          onKeyUp={handleKeyUp}
          placeholder="Type your message..."
          className="w-full border border-gray-300 rounded p-2"
        />
      </div>
    </div>
  );
};

export default Chat;
