"use client"

import { useState, useEffect, useRef, useCallback } from "react"

type Message = {
  id: string
  role: "user" | "assistant"
  text: string
}

const BOOK_CALL_REGEX = /\|\|\|BOOK_CALL\|\|\|([\s\S]*?)\|\|\|END\|\|\|/

export default function Chatbot() {
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const [loading, setLoading] = useState(false)
  const [showBubble, setShowBubble] = useState(false)
  const [hasGreeted, setHasGreeted] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowBubble(true)
    }, 2000)
    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const handleOpen = useCallback(() => {
    setOpen(true)
    setShowBubble(false)
    if (!hasGreeted) {
      setHasGreeted(true)
      setMessages([
        {
          id: "greeting",
          role: "assistant",
          text: "Hey! Got an app idea brewing? You're in the right place. Hassan builds pixel-perfect Flutter apps in days, not months. What's on your mind?",
        },
      ])
    }
  }, [hasGreeted])

  const saveBooking = async (bookingData: { name: string; email?: string; call_date: string; call_time: string }) => {
    try {
      await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...bookingData,
          source: "chatbot_booking",
          message: `Call booked via chatbot for ${bookingData.call_date} at ${bookingData.call_time}`,
        }),
      })
    } catch (err) {
      console.error("Failed to save booking:", err)
    }
  }

  const sendMessage = async () => {
    const trimmed = input.trim()
    if (!trimmed || loading) return

    const userMsg: Message = { id: Date.now().toString(), role: "user", text: trimmed }
    const updatedMessages = [...messages, userMsg]
    setMessages(updatedMessages)
    setInput("")
    setLoading(true)

    try {
      const chatHistory = updatedMessages
        .filter((m) => m.id !== "greeting")
        .map((m) => ({
          role: m.role === "user" ? ("user" as const) : ("model" as const),
          parts: [{ text: m.text }],
        }))

      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: chatHistory }),
      })

      const data = await res.json()

      if (data.success && data.reply) {
        let replyText = data.reply as string

        const bookingMatch = replyText.match(BOOK_CALL_REGEX)
        if (bookingMatch) {
          try {
            const bookingData = JSON.parse(bookingMatch[1])
            await saveBooking(bookingData)
          } catch {
            console.error("Failed to parse booking data")
          }
          replyText = replyText.replace(BOOK_CALL_REGEX, "").trim()
        }

        setMessages((prev) => [
          ...prev,
          { id: (Date.now() + 1).toString(), role: "assistant", text: replyText },
        ])
      } else {
        setMessages((prev) => [
          ...prev,
          { id: (Date.now() + 1).toString(), role: "assistant", text: "Oops, something went wrong. Try again?" },
        ])
      }
    } catch {
      setMessages((prev) => [
        ...prev,
        { id: (Date.now() + 1).toString(), role: "assistant", text: "Connection hiccup! Give it another shot." },
      ])
    } finally {
      setLoading(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  return (
    <>
      {/* Notification bubble */}
      {showBubble && !open && (
        <button
          onClick={handleOpen}
          className="fixed bottom-24 right-8 z-50 max-w-xs animate-fade-in"
        >
          <div className="bg-card border border-primary/40 rounded-2xl rounded-br-sm px-4 py-3 shadow-lg shadow-primary/20">
            <p className="text-sm text-foreground">
              Got an app idea? Let&apos;s talk!
            </p>
          </div>
        </button>
      )}

      {/* Chat toggle button */}
      <button
        onClick={() => (open ? setOpen(false) : handleOpen())}
        className="fixed bottom-8 right-8 z-50 w-14 h-14 bg-gradient-to-br from-primary to-secondary text-primary-foreground rounded-full shadow-lg shadow-primary/50 hover:shadow-xl hover:shadow-primary/60 transition-all duration-300 flex items-center justify-center text-xl"
        aria-label={open ? "Close chat" : "Open chat"}
      >
        {open ? "✕" : "💬"}
      </button>

      {/* Chat window */}
      {open && (
        <div className="fixed bottom-24 right-8 z-50 w-[360px] max-w-[calc(100vw-2rem)] h-[500px] max-h-[calc(100vh-8rem)] flex flex-col bg-background border border-primary/30 rounded-2xl shadow-2xl shadow-primary/20 overflow-hidden animate-fade-in">
          {/* Header */}
          <div className="px-4 py-3 bg-gradient-to-r from-primary/20 to-secondary/20 border-b border-primary/30 flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-primary-foreground text-sm font-bold">
              H
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-foreground truncate">Hassan&apos;s AI Rep</p>
              <p className="text-xs text-foreground/50">Typically replies instantly</p>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[80%] px-3 py-2 rounded-2xl text-sm leading-relaxed ${
                    msg.role === "user"
                      ? "bg-primary/20 text-foreground rounded-br-sm"
                      : "bg-card border border-primary/20 text-foreground rounded-bl-sm"
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="bg-card border border-primary/20 text-foreground rounded-2xl rounded-bl-sm px-3 py-2 text-sm">
                  <span className="inline-flex gap-1">
                    <span className="w-1.5 h-1.5 bg-primary/60 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                    <span className="w-1.5 h-1.5 bg-primary/60 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                    <span className="w-1.5 h-1.5 bg-primary/60 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                  </span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="px-3 py-3 border-t border-primary/20">
            <div className="flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                disabled={loading}
                placeholder="Type a message..."
                className="flex-1 px-3 py-2 bg-card border border-primary/30 rounded-xl text-sm text-foreground placeholder:text-foreground/40 focus:outline-none focus:border-primary transition-colors disabled:opacity-50"
              />
              <button
                onClick={sendMessage}
                disabled={loading || !input.trim()}
                className="px-3 py-2 bg-gradient-to-r from-primary to-secondary text-primary-foreground rounded-xl text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg hover:shadow-primary/30 transition-all"
              >
                Send
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
