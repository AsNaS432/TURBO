import React, { useState } from 'react'

const quickReplies = [
  'Как оформить заказ?',
  'Связаться с оператором',
]

const ChatPopup = () => {
  const [messages, setMessages] = useState([
    { id: 1, text: 'Здравствуйте! Чем могу помочь?', from: 'bot' },
  ])
  const [inputValue, setInputValue] = useState('')
  const [isOpen, setIsOpen] = useState(true)

  const handleQuickReply = (text) => {
    setMessages((prev) => [...prev, { id: Date.now(), text, from: 'user' }])
    // Here you can add logic to respond to quick replies if needed
  }

  const handleSend = () => {
    if (inputValue.trim() === '') return
    setMessages((prev) => [...prev, { id: Date.now(), text: inputValue, from: 'user' }])
    setInputValue('')
    // Here you can add logic to respond to user messages if needed
  }

  const handleInputKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      handleSend()
    }
  }

  return isOpen ? (
    <div className="fixed bottom-6 right-6 w-80 bg-white border border-neutral-300 rounded-lg shadow-lg flex flex-col">
      <div className="p-4 flex-1 overflow-y-auto max-h-96">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`mb-2 max-w-[80%] px-3 py-2 rounded-lg text-sm ${
              msg.from === 'bot'
                ? 'bg-gray-200 text-gray-800 self-start rounded-bl-none'
                : 'bg-primary-600 text-white self-end rounded-br-none'
            }`}
          >
            {msg.text}
          </div>
        ))}
      </div>
      <div className="px-4 pb-2">
        <div className="flex flex-wrap gap-2 mb-2">
          {quickReplies.map((text) => (
            <button
              key={text}
              onClick={() => handleQuickReply(text)}
              className="bg-primary-600 text-white text-xs rounded-full px-3 py-1 hover:bg-primary-700 transition"
            >
              {text}
            </button>
          ))}
        </div>
        <div className="flex">
          <input
            type="text"
            placeholder="Введите сообщение..."
            className="flex-1 border border-neutral-300 rounded-l-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleInputKeyDown}
          />
          <button
            onClick={handleSend}
            className="bg-primary-600 text-white px-4 py-2 rounded-r-md hover:bg-primary-700 transition"
          >
            Отправить
          </button>
        </div>
      </div>
      <button
        onClick={() => setIsOpen(false)}
        className="absolute top-1 right-1 text-gray-500 hover:text-gray-700"
        aria-label="Закрыть чат"
      >
        &#10005;
      </button>
    </div>
  ) : (
    <button
      onClick={() => setIsOpen(true)}
      className="fixed bottom-6 right-6 bg-primary-600 text-white rounded-full w-12 h-12 flex items-center justify-center shadow-lg hover:bg-primary-700 transition"
      aria-label="Открыть чат"
      title="Открыть чат"
    >
      {/* Chat icon SVG */}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-6 w-6"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M8 10h.01M12 10h.01M16 10h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72A7.969 7.969 0 013 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
        />
      </svg>
    </button>
  )
}

export default ChatPopup
