import React, { useEffect, useMemo, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Spline from '@splinetool/react-spline'
import { Instagram, Linkedin, Sparkles, Quote, Send, MapPin, Palette, Compass, Cog } from 'lucide-react'
import Loader from './Loader'

const useParallax = (intensity = 0.2) => {
  const ref = useRef(null)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const onScroll = () => {
      const y = window.scrollY
      el.style.transform = `translate3d(0, ${y * intensity}px, 0)`
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [intensity])
  return ref
}

function GlowOrb({ className = '', colorFrom = 'from-amber-200/30', colorTo = 'to-fuchsia-400/25', size = 'h-56 w-56', x = 'left-10', y = 'top-10', blur = 'blur-2xl' }) {
  return (
    <div className={`pointer-events-none absolute ${x} ${y} ${size} ${blur} rounded-full bg-gradient-to-br ${colorFrom} ${colorTo}`}></div>
  )
}

function SectionHeader({ kicker, title, subtitle }) {
  return (
    <div className="max-w-3xl mx-auto text-center mb-12">
      <p className="tracking-[0.25em] uppercase text-white/50 text-xs mb-3">{kicker}</p>
      <h2 className="text-3xl md:text-5xl font-semibold leading-tight text-white/90">{title}</h2>
      {subtitle && <p className="mt-4 text-white/60">{subtitle}</p>}
    </div>
  )
}

export default function App() {
  const [loadingDone, setLoadingDone] = useState(false)
  const [testimonials, setTestimonials] = useState([])
  const [sending, setSending] = useState(false)
  const [sent, setSent] = useState(null)
  const [form, setForm] = useState({ name: '', email: '', message: '' })
  const baseUrl = useMemo(() => import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000', [])

  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        const res = await fetch(`${baseUrl}/testimonials?limit=5`)
        if (res.ok) {
          const data = await res.json()
          setTestimonials(data)
        }
      } catch (e) {
        // Silent fail; show defaults
      }
    }
    fetchTestimonials()
  }, [baseUrl])

  const heroParallax = useParallax(0.06)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSending(true)
    setSent(null)
    try {
      const res = await fetch(`${baseUrl}/feedback`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form }),
      })
      if (res.ok) {
        setSent({ ok: true, msg: "Thank you — we'll be in touch." })
        setForm({ name: '', email: '', message: '' })
      } else {
        const t = await res.json().catch(() => ({}))
        setSent({ ok: false, msg: t.detail || 'Something went wrong. Please try again.' })
      }
    } catch (e) {
      setSent({ ok: false, msg: 'Network error. Please try again.' })
    } finally {
      setSending(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#0a0b10] text-white overflow-x-hidden">
      <Loader onComplete={() => setLoadingDone(true)} />

      {/* Floating ambient glows */}
      <GlowOrb x="-left-16" y="-top-16" size="h-80 w-80" />
      <GlowOrb x="-right-16" y="top-1/3" size="h-72 w-72" colorFrom="from-cyan-200/20" colorTo="to-emerald-300/10" />
      <GlowOrb x="left-1/3" y="bottom-16" size="h-64 w-64" colorFrom="from-fuchsia-300/10" colorTo="to-rose-400/10" />

      {/* Hero */}
      <section className="relative min-h-[90vh] flex items-center">
        <div className="absolute inset-0 -z-10 opacity-60">
          {/* Spline 3D animation background */}
          <Spline scene="https://prod.spline.design/4Zh-Q6DWWp5yPnQf/scene.splinecode" />
        </div>

        {/* Parallax headline */}
        <div ref={heroParallax} className="relative z-10 w-full">
          <div className="max-w-6xl mx-auto px-6 pt-24 pb-16">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.0, ease: 'easeOut', delay: 0.2 }}
              className="text-[40px] md:text-[80px] leading-[1.05] font-semibold tracking-tight drop-shadow-[0_6px_40px_rgba(255,230,200,0.15)]"
            >
              Crafting Unforgettable Moments
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="mt-6 max-w-2xl text-white/70"
            >
              World‑class event design and production studio. We create exclusive experiences across the globe — from couture weddings to immersive brand spectacles.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.7 }}
              className="mt-10 flex flex-wrap items-center gap-4"
            >
              <a href="#contact" className="group inline-flex items-center gap-2 rounded-full px-6 py-3 bg-white/10 border border-white/15 backdrop-blur-lg hover:bg-white/15 transition">
                <Sparkles size={18} className="text-amber-200 group-hover:scale-110 transition" />
                <span className="font-medium">Let’s Create Magic</span>
              </a>
              <a href="#services" className="inline-flex items-center rounded-full px-6 py-3 bg-gradient-to-r from-amber-300/20 to-fuchsia-400/20 border border-white/15 hover:from-amber-300/30 hover:to-fuchsia-400/30 transition">
                Explore Services
              </a>
            </motion.div>
          </div>
        </div>
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-[#0a0b10]/20 via-transparent to-[#0a0b10]" />
      </section>

      {/* About */}
      <section id="about" className="relative py-24 md:py-32">
        <SectionHeader
          kicker="About"
          title="A Cinematic Approach to Experience Design"
          subtitle="We blend creative direction, architecture, and technology to compose moments that resonate long after the lights fade."
        />
        <div className="max-w-5xl mx-auto px-6 grid md:grid-cols-3 gap-8 items-start">
          {[
            { label: 'Studios in', value: 'NYC — Paris — Dubai', Icon: MapPin },
            { label: 'Signature', value: 'Glassmorphic light & nature motifs', Icon: Palette },
            { label: 'Philosophy', value: 'Human, immersive, unforgettable', Icon: Sparkles },
          ].map((i, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: idx * 0.08 }}
              className="rounded-2xl p-6 border border-white/10 bg-white/5 backdrop-blur-xl hover:bg-white/10 transition"
            >
              <i.Icon className="text-white/80" />
              <p className="mt-4 text-white/60 text-sm uppercase tracking-widest">{i.label}</p>
              <p className="mt-1 text-xl text-white/90">{i.value}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Services */}
      <section id="services" className="relative py-24 md:py-32">
        <SectionHeader kicker="Services" title="Elevated End‑to‑End Production" />
        <div className="max-w-6xl mx-auto px-6 grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { title: 'Luxury Event Design', desc: 'Custom concepts and full visual identity.', Icon: Palette },
            { title: 'Event Production & Management', desc: 'Planning to execution with precision.', Icon: Cog },
            { title: 'Destination Events', desc: 'Exotic locations, boutique logistics.', Icon: Compass },
            { title: 'Creative Direction & Styling', desc: 'Artistic supervision and storytelling.', Icon: Sparkles },
          ].map((card, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.04] backdrop-blur-xl p-6 hover:-translate-y-1 transition will-change-transform"
            >
              <div className="absolute -inset-1 opacity-0 group-hover:opacity-20 transition bg-gradient-to-br from-amber-300 via-fuchsia-400 to-cyan-300 blur-2xl" />
              <div className="relative z-10">
                <card.Icon className="text-white/90" />
                <h3 className="mt-4 text-xl font-semibold text-white">{card.title}</h3>
                <p className="mt-2 text-white/70 text-sm">{card.desc}</p>
                <div className="mt-6 h-10 w-10 rounded-full bg-white/10 border border-white/15 flex items-center justify-center group-hover:scale-110 group-hover:bg-white/20 transition">
                  <Sparkles size={18} className="text-amber-200" />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="relative py-24 md:py-32">
        <SectionHeader kicker="Kind Words" title="Stories from Our Clients" />
        <div className="max-w-5xl mx-auto px-6 grid md:grid-cols-3 gap-6">
          <AnimatePresence>
            {(testimonials?.length ? testimonials : [
              { id: '1', name: 'A.', message: 'An extraordinary experience — every detail felt bespoke and poetic.' },
              { id: '2', name: 'M.', message: 'The team turned our vision into a cinematic reality.' },
              { id: '3', name: 'S.', message: 'Seamless production, breathtaking aesthetics. Unforgettable.' },
            ]).map((t, idx) => (
              <motion.blockquote
                key={t.id || idx}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: idx * 0.1 }}
                className="relative rounded-2xl p-6 border border-white/10 bg-white/5 backdrop-blur-xl"
              >
                <Quote className="absolute -top-4 -left-4 text-white/20" />
                <p className="text-white/80">{t.message}</p>
                <div className="mt-4 text-sm text-white/60">— {t.name}</div>
              </motion.blockquote>
            ))}
          </AnimatePresence>
        </div>

        {/* Feedback form inline */}
        <div className="max-w-3xl mx-auto px-6 mt-12">
          <div className="rounded-2xl border border-white/10 bg-white/[0.04] backdrop-blur-xl p-6">
            <h3 className="text-2xl font-semibold">Leave Feedback</h3>
            <p className="text-white/60 mt-1">Share a note — we love hearing from our guests and partners.</p>
            <form onSubmit={handleSubmit} className="mt-6 grid md:grid-cols-2 gap-4">
              <input value={form.name} onChange={e=>setForm(v=>({...v,name:e.target.value}))} required placeholder="Name" className="w-full rounded-xl bg-white/5 border border-white/10 px-4 py-3 outline-none focus:ring-2 focus:ring-amber-300/40" />
              <input value={form.email} onChange={e=>setForm(v=>({...v,email:e.target.value}))} type="email" placeholder="Email (optional)" className="w-full rounded-xl bg-white/5 border border-white/10 px-4 py-3 outline-none focus:ring-2 focus:ring-amber-300/40" />
              <textarea value={form.message} onChange={e=>setForm(v=>({...v,message:e.target.value}))} required placeholder="Your message" rows={4} className="md:col-span-2 w-full rounded-xl bg-white/5 border border-white/10 px-4 py-3 outline-none focus:ring-2 focus:ring-amber-300/40" />
              <div className="md:col-span-2 flex items-center justify-between gap-4">
                <button disabled={sending} className="group inline-flex items-center gap-2 rounded-full px-6 py-3 bg-white/10 border border-white/15 backdrop-blur-lg hover:bg-white/15 transition disabled:opacity-60">
                  <Send size={18} className="group-hover:translate-x-0.5 transition" />
                  <span>Submit Feedback</span>
                </button>
                {sent && (
                  <span className={`${sent.ok ? 'text-emerald-300' : 'text-rose-300'} text-sm`}>{sent.msg}</span>
                )}
              </div>
            </form>
          </div>
        </div>
      </section>

      {/* Social / Follow */}
      <section id="follow" className="relative py-20">
        <SectionHeader kicker="Follow Us" title="Join the Journey" subtitle="Find daily inspiration and behind‑the‑scenes magic" />
        <div className="max-w-4xl mx-auto px-6 flex items-center justify-center gap-6">
          {[
            { href: '#', Icon: Instagram, label: 'Instagram' },
            { href: '#', Icon: Linkedin, label: 'LinkedIn' },
          ].map((s, idx) => (
            <a key={idx} href={s.href} aria-label={s.label} className="group relative">
              <span className="absolute -inset-6 rounded-full bg-gradient-to-br from-amber-300/0 via-fuchsia-500/0 to-cyan-400/0 group-hover:from-amber-300/20 group-hover:via-fuchsia-500/20 group-hover:to-cyan-400/20 blur-2xl transition" />
              <div className="relative h-16 w-16 rounded-2xl border border-white/10 bg-white/[0.04] backdrop-blur-xl flex items-center justify-center group-hover:scale-105 transition">
                <s.Icon className="text-white" />
              </div>
            </a>
          ))}
        </div>
      </section>

      {/* Contact */}
      <section id="contact" className="relative py-24">
        <SectionHeader kicker="Contact" title="Tell Us About Your Vision" />
        <div className="max-w-4xl mx-auto px-6">
          <form onSubmit={handleSubmit} className="grid md:grid-cols-2 gap-4 rounded-2xl border border-white/10 bg-white/[0.04] backdrop-blur-xl p-6">
            <input value={form.name} onChange={e=>setForm(v=>({...v,name:e.target.value}))} required placeholder="Name" className="w-full rounded-xl bg-white/5 border border-white/10 px-4 py-3 outline-none focus:ring-2 focus:ring-amber-300/40" />
            <input value={form.email} onChange={e=>setForm(v=>({...v,email:e.target.value}))} type="email" placeholder="Email" className="w-full rounded-xl bg-white/5 border border-white/10 px-4 py-3 outline-none focus:ring-2 focus:ring-amber-300/40" />
            <textarea value={form.message} onChange={e=>setForm(v=>({...v,message:e.target.value}))} required placeholder="Tell us about your event" rows={6} className="md:col-span-2 w-full rounded-xl bg-white/5 border border-white/10 px-4 py-3 outline-none focus:ring-2 focus:ring-amber-300/40" />
            <div className="md:col-span-2 flex items-center justify-between gap-4">
              <button disabled={sending} className="group inline-flex items-center gap-2 rounded-full px-6 py-3 bg-gradient-to-r from-amber-300/20 to-fuchsia-400/20 border border-white/15 hover:from-amber-300/30 hover:to-fuchsia-400/30 transition disabled:opacity-60">
                <Sparkles size={18} className="group-hover:scale-110 transition" />
                <span>Let’s Create Magic</span>
              </button>
              {sent && (
                <span className={`${sent.ok ? 'text-emerald-300' : 'text-rose-300'} text-sm`}>{sent.msg}</span>
              )}
            </div>
          </form>
        </div>
      </section>

      <footer className="relative py-10 text-center text-white/50 text-sm">
        © {new Date().getFullYear()} World‑Class Event Design & Production
      </footer>
    </div>
  )
}
