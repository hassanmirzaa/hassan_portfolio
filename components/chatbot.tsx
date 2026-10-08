"use client"

import { useState, useEffect, useRef, useCallback } from "react"

type Message = { id: string; role: "user" | "assistant"; text: string }

const BOOK_CALL_REGEX = /\|\|\|BOOK_CALL\|\|\|([\s\S]*?)\|\|\|END\|\|\|/
const GREETING =
  "Hey! Got an app idea brewing? Hassan builds the whole thing: Flutter app, Laravel or Node backend, and the store release. What are you thinking of building?"

export default function Chatbot() {
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const [loading, setLoading] = useState(false)
  const [bubble, setBubble] = useState(false)
  const end = useRef<HTMLDivElement>(null)
  const greeted = useRef(false)

  useEffect(() => {
    let seen = false
    try {
      seen = sessionStorage.getItem("chat-bubble") === "1"
    } catch {}
    if (seen) return
    const show = setTimeout(() => setBubble(true), 4000)
    const hide = setTimeout(() => setBubble(false), 12000)
    return () => {
      clearTimeout(show)
      clearTimeout(hide)
    }
  }, [])

  useEffect(() => {
    end.current?.scrollIntoView({ behavior: "smooth", block: "end" })
  }, [messages, loading])

  const openChat = useCallback(() => {
    setOpen(true)
    setBubble(false)
    try {
      sessionStorage.setItem("chat-bubble", "1")
    } catch {}
    if (!greeted.current) {
      greeted.current = true
      setMessages([{ id: "greeting", role: "assistant", text: GREETING }])
    }
  }, [])

  const saveBooking = async (b: { name: string; email?: string; call_date: string; call_time: string }) => {
    try {
      await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...b,
          source: "chatbot",
          message: `Call requested via chatbot for ${b.call_date} at ${b.call_time}`,
        }),
      })
    } catch {}
  }

  const send = async () => {
    const text = input.trim()
    if (!text || loading) return
    const next = [...messages, { id: String(Date.now()), role: "user" as const, text }]
    setMessages(next)
    setInput("")
    setLoading(true)
    const add = (t: string) => setMessages((p) => [...p, { id: String(Date.now() + 1), role: "assistant", text: t }])
    try {
      const history = next
        .filter((m) => m.id !== "greeting")
        .map((m) => ({ role: m.role === "user" ? ("user" as const) : ("model" as const), parts: [{ text: m.text }] }))
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: history }),
      })
      const data = await res.json()
      if (data.success && data.reply) {
        let reply = data.reply as string
        const m = reply.match(BOOK_CALL_REGEX)
        if (m) {
          try {
            await saveBooking(JSON.parse(m[1]))
          } catch {}
          reply = reply.replace(BOOK_CALL_REGEX, "").trim()
        }
        add(reply)
      } else {
        add("Something went wrong on my side. Try again, or email Hassan directly.")
      }
    } catch {
      add("Connection hiccup. Give it another go.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      {bubble && !open && (
        <button className="chat-bubble" onClick={openChat}>
          Got an app idea? Let&apos;s talk!
        </button>
      )}
      <button
        className="chat-fab"
        onClick={() => (open ? setOpen(false) : openChat())}
        aria-label={open ? "Close chat" : "Open chat"}
        aria-expanded={open}
      >
        {open ? "✕" : "Hi"}
      </button>
      {open && (
        <div className="chat-win" role="dialog" aria-label="Chat with Hassan's assistant">
          <div className="chat-head">
            <div className="av">H</div>
            <div>
              <b>Hassan&apos;s assistant</b>
              <small>AI · replies instantly</small>
            </div>
          </div>
          <div className="chat-log" aria-live="polite">
            {messages.map((m) => (
              <div key={m.id} className={`msg ${m.role === "user" ? "me" : "bot"}`}>
                {m.text}
              </div>
            ))}
            {loading && (
              <div className="msg bot dots" aria-label="Typing">
                <span />
                <span />
                <span />
              </div>
            )}
            <div ref={end} />
          </div>
          <form
            className="chat-in"
            onSubmit={(e) => {
              e.preventDefault()
              send()
            }}
          >
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type a message…"
              maxLength={1000}
              disabled={loading}
              aria-label="Your message"
              enterKeyHint="send"
            />
            <button type="submit" disabled={loading || !input.trim()}>
              Send
            </button>
          </form>
        </div>
      )}
    </>
  )
}
