'use client';

import React from 'react';

export default function GamingHomePage() {
  return (
    <div className="min-h-screen bg-white text-gray-900">
      {/* Barra superior de anuncio */}
      <div className="w-full bg-[#f03434] text-white text-center text-xs md:text-sm font-semibold py-2 tracking-wide">
        OFERTA EN TODO EL SITIO TERMINA EN 72 HORAS 🔥
      </div>

      {/* Header / Navbar */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur border-b border-gray-100">
        <div className="max-w-6xl mx-auto flex items-center justify-between px-4 md:px-6 py-4">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center text-white font-black text-lg">
              M4G
            </div>
            <span className="font-black tracking-tight text-lg">
              Money<span className="text-indigo-600">For</span>Gamers
            </span>
          </div>

          {/* Nav links */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium">
            <a href="#" className="px-3 py-1 rounded-full bg-gray-900 text-white">
              Home
            </a>
            <a href="#shop" className="hover:text-indigo-600 transition-colors">
              Tienda
            </a>
            <a href="#benefits" className="hover:text-indigo-600 transition-colors">
              Beneficios
            </a>
            <a href="#support" className="hover:text-indigo-600 transition-colors">
              Soporte
            </a>
          </nav>

          {/* Icons simples */}
          <div className="flex items-center gap-4 text-gray-700">
            <button aria-label="Buscar" className="hover:text-indigo-600">
              🔍
            </button>
            <button aria-label="Cuenta" className="hover:text-indigo-600">
              👤
            </button>
            <button aria-label="Carrito" className="relative hover:text-indigo-600">
              🛒
              <span className="absolute -top-2 -right-2 bg-red-500 text-[10px] text-white font-bold rounded-full px-1.5">
                3
              </span>
            </button>
          </div>
        </div>
      </header>

      {/* HERO */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#f03434] via-[#ff5a2c] to-[#ff8a2c]">
        <div className="max-w-6xl mx-auto px-4 md:px-6 py-12 md:py-20 flex flex-col md:flex-row items-center gap-10">
          {/* Imagen producto / mockup */}
          <div className="relative w-full md:w-1/2 flex justify-center">
            <div className="relative">
              <div className="absolute -inset-10 bg-black/10 rounded-[3rem] blur-2xl" />
              <div className="relative bg-[#003087] rounded-[2.4rem] shadow-2xl border-4 border-white/70 overflow-hidden w-[320px] h-[340px] flex flex-col">
                {/* Parte superior blanca con texto */}
                <div className="bg-white px-5 pt-5 pb-4 flex items-start justify-between">
                  <div>
                    <p className="text-xs font-black tracking-[0.12em] text-[#003087]">
                      GIFT CARD
                    </p>
                    <p className="mt-1 text-[11px] text-gray-500 uppercase">
                      Juegos & Suscripciones
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-[32px] leading-none font-black text-[#003087]">
                      $50
                    </p>
                    <p className="text-[11px] font-bold tracking-[0.18em] text-[#003087] mt-1">
                      USD
                    </p>
                  </div>
                </div>

                {/* Parte azul con logo y texto */}
                <div className="flex-1 flex flex-col items-center justify-center gap-5">
                  <div className="w-20 h-20 rounded-2xl bg-white/10 border border-white/40 flex items-center justify-center">
                    <span className="text-3xl">🎮</span>
                  </div>
                  <div className="text-center text-white">
                    <p className="text-lg font-semibold tracking-wide">
                      PIN DIGITAL INSTANTÁNEO
                    </p>
                    <p className="text-xs text-white/80 mt-1">
                      PlayStation · Xbox · Nintendo · Steam
                    </p>
                  </div>
                </div>

                {/* Barra inferior */}
                <div className="bg-white py-3 flex items-center justify-center">
                  <span className="text-[10px] font-black tracking-[0.35em] text-[#003087]">
                    DIGITAL&nbsp;CODE
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Texto HERO */}
          <div className="w-full md:w-1/2 text-center md:text-left text-white">
            <p className="text-xs md:text-sm uppercase tracking-[0.25em] font-semibold mb-3">
              EL #1 EN PINS DIGITALES
            </p>
            <h1 className="text-3xl md:text-5xl font-black leading-tight mb-4">
              RECARGA TUS JUEGOS
              <br />
              EN SEGUNDOS.
            </h1>
            <p className="text-sm md:text-base text-white/80 max-w-md mx-auto md:mx-0 mb-6">
              Compra gift cards y pines digitales de tus plataformas favoritas con entrega
              instantánea, precios competitivos y métodos de pago locales.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center md:justify-start gap-3">
              <button className="px-7 py-3 bg-white text-[#f03434] rounded-full text-sm font-semibold tracking-wide shadow-lg hover:bg-gray-100 transition">
                COMPRA AHORA
              </button>
              <button className="px-7 py-3 border border-white/70 text-white rounded-full text-sm font-semibold tracking-wide hover:bg-white/10 transition">
                VER CATÁLOGO
              </button>
            </div>

            <p className="mt-4 text-xs text-white/70">
              Entrega automática 24/7 · Soporte por WhatsApp · Más de 10.000 gamers felices
            </p>
          </div>
        </div>
      </section>

      {/* As seen on */}
      <section className="bg-white py-10">
        <div className="max-w-5xl mx-auto px-4 md:px-6 text-center">
          <p className="text-xs font-semibold tracking-[0.25em] uppercase text-gray-500 mb-6">
            ALIADOS & PLATAFORMAS
          </p>
          <div className="flex flex-wrap items-center justify-center gap-10 opacity-80">
            <span className="text-2xl font-black tracking-wide">PlayStation</span>
            <span className="text-2xl font-black tracking-wide text-green-600">Xbox</span>
            <span className="text-2xl font-black tracking-wide text-red-500">Nintendo</span>
            <span className="text-xl font-semibold tracking-wide">Steam</span>
            <span className="text-xl font-semibold tracking-wide">Riot · Roblox · EA</span>
          </div>
        </div>
      </section>

      {/* Banda slogan tipo "REVITALIZE YOUR BODY" */}
      <section className="bg-[#f03434] text-white text-xs md:text-sm font-semibold tracking-[0.2em] uppercase py-3 overflow-hidden">
        <div className="whitespace-nowrap animate-[marquee_24s_linear_infinite]">
          <span className="mx-8">RECARGA AL INSTANTE</span>
          <span className="mx-8">MEJORES PRECIOS PARA GAMERS</span>
          <span className="mx-8">MÉTODOS DE PAGO LOCALES</span>
          <span className="mx-8">SOPORTE 24/7</span>
          <span className="mx-8">STOCK ACTUALIZADO</span>
        </div>
      </section>

      {/* Sección “Backed By” */}
      <section id="shop" className="bg-[#f03434] text-white py-12 md:py-16">
        <div className="max-w-5xl mx-auto px-4 md:px-6 text-center md:text-left">
          <h2 className="text-2xl md:text-3xl font-black mb-4">
            Confiado por miles de gamers en Latinoamérica
          </h2>
          <p className="text-sm md:text-base text-white/90 max-w-3xl">
            Durante los últimos años hemos procesado miles de recargas y gift cards para
            consolas, PC y mobile. Optimizado para compras rápidas, seguras y sin errores en
            códigos. Nuestro sistema automatizado valida cada pin antes de enviarlo, para una
            experiencia sin preocupaciones.
          </p>
        </div>
      </section>

      {/* Beneficios + tabla comparativa */}
      <section
        id="benefits"
        className="bg-white py-14 md:py-20 border-t border-gray-100"
      >
        <div className="max-w-6xl mx-auto px-4 md:px-6">
          <h2 className="text-2xl md:text-3xl font-black text-center mb-3">
            BENEFICIOS INCOMPARABLES
          </h2>
          <p className="text-sm md:text-base text-gray-600 text-center max-w-2xl mx-auto mb-10">
            Paga como quieres, recibe al instante y juega sin complicaciones. Tu tiempo es
            para jugar, no para esperar.
          </p>

          <div className="grid md:grid-cols-[3fr,2fr] gap-10 items-start">
            {/* Cards de beneficios */}
            <div className="grid sm:grid-cols-2 gap-6">
              <BenefitCard
                icon="⚡"
                title="Entrega instantánea"
                text="Los códigos llegan a tu correo y panel en segundos después del pago."
              />
              <BenefitCard
                icon="💳"
                title="Pagos flexibles"
                text="Tarjeta de crédito, PSE, billeteras digitales y efectivo en puntos aliados."
              />
              <BenefitCard
                icon="🛡️"
                title="100% verificados"
                text="Todos los pines pasan por un sistema de validación para evitar códigos inválidos."
              />
              <BenefitCard
                icon="🎁"
                title="Catálogo gamer total"
                text="Gift cards, membresías online, monedas in-game y más para tus juegos favoritos."
              />
            </div>

            {/* Tabla comparativa */}
            <div className="rounded-3xl overflow-hidden shadow-xl border border-gray-200">
              <div className="bg-[#f03434] text-white py-4 px-6 flex justify-between items-center">
                <span className="font-bold text-sm">MoneyForGamers</span>
                <span className="text-xs uppercase tracking-[0.25em]">Otros</span>
              </div>
              <div className="bg-white">
                {[
                  {
                    label: 'Entrega en segundos',
                    m4g: '✔',
                    others: '✖',
                  },
                  {
                    label: 'Soporte gamer 24/7',
                    m4g: '✔',
                    others: '✖',
                  },
                  {
                    label: 'Precios pensados para LATAM',
                    m4g: '✔',
                    others: '✖',
                  },
                  {
                    label: 'Pagos locales (PSE, Nequi, etc.)',
                    m4g: '✔',
                    others: '✖',
                  },
                ].map((row) => (
                  <div
                    key={row.label}
                    className="flex items-center justify-between px-6 py-3 border-t border-gray-100 text-sm"
                  >
                    <span className="font-medium text-gray-800">{row.label}</span>
                    <div className="flex items-center gap-12">
                      <span className="font-bold text-green-500">{row.m4g}</span>
                      <span className="font-bold text-gray-400">{row.others}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Sección “Sooo many benefits” */}
      <section className="bg-white">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-0">
          <div className="relative min-h-[260px] md:min-h-[320px] bg-gray-900">
            {/* Aquí puedes poner un <Image /> real */}
            <div className="absolute inset-0 bg-[url('/images/gaming-hero.jpg')] bg-cover bg-center opacity-80" />
            <div className="relative h-full flex flex-col justify-center px-6 md:px-10 text-white">
              <h2 className="text-2xl md:text-3xl font-black mb-3">
                Tantos beneficios, un solo lugar.
              </h2>
              <p className="text-sm md:text-base text-white/80 mb-5 max-w-md">
                Olvídate de comprar códigos en sitios dudosos. Centraliza todas tus recargas
                en una sola plataforma segura y rápida.
              </p>
              <button className="inline-flex items-center justify-center px-6 py-3 bg-[#f03434] rounded-full text-sm font-semibold shadow-lg hover:bg-[#e12020] transition">
                QUIERO PROBARLO
              </button>
            </div>
          </div>

          <div className="bg-[#f03434] text-white flex items-center justify-center px-6 md:px-10 py-10">
            <div className="space-y-2 text-center md:text-left font-black text-sm md:text-lg tracking-[0.25em] leading-loose uppercase opacity-90">
              <div>ENTREGA INSTANTÁNEA</div>
              <div>MEJORES PRECIOS</div>
              <div>MÉTODOS DE PAGO LOCALES</div>
              <div>CATÁLOGO COMPLETO</div>
              <div>SOPORTE GAMER</div>
            </div>
          </div>
        </div>
      </section>

      {/* Trusted by (testimonios) */}
      <section id="support" className="bg-white py-14 md:py-20">
        <div className="max-w-6xl mx-auto px-4 md:px-6">
          <h2 className="text-2xl md:text-3xl font-black text-center mb-8">
            Amado por gamers reales
          </h2>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                name: 'Juan, jugador de FIFA',
                text: '“Cargo mis FIFA Points en menos de 1 minuto. Nunca tuve un problema con un código.”',
              },
              {
                name: 'Laura, fan de Nintendo',
                text: '“Los métodos de pago locales hacen todo más fácil. Perfecto para regalar.”',
              },
              {
                name: 'Carlos, streamer',
                text: '“Uso la tienda para sorteos en mi canal. Todo automático y súper confiable.”',
              },
            ].map((t) => (
              <div
                key={t.name}
                className="rounded-2xl border border-gray-100 shadow-sm p-5 flex flex-col gap-3"
              >
                <p className="text-sm text-gray-700 leading-relaxed">{t.text}</p>
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                  {t.name}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Botón flotante scroll top */}
      <button
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        className="fixed bottom-6 right-6 w-10 h-10 rounded-full bg-[#f03434] text-white flex items-center justify-center shadow-lg text-lg hover:bg-[#e12020] transition"
        aria-label="Volver arriba"
      >
        ↑
      </button>

      <style jsx global>{`
        @keyframes marquee {
          0% {
            transform: translateX(0%);
          }
          100% {
            transform: translateX(-50%);
          }
        }
      `}</style>
    </div>
  );
}

type BenefitProps = {
  icon: string;
  title: string;
  text: string;
};

function BenefitCard({ icon, title, text }: BenefitProps) {
  return (
    <div className="bg-gray-50 rounded-2xl p-5 flex flex-col gap-3 border border-gray-100">
      <div className="w-10 h-10 rounded-xl bg-white shadow flex items-center justify-center text-xl">
        {icon}
      </div>
      <div>
        <h3 className="font-semibold mb-1 text-sm">{title}</h3>
        <p className="text-xs text-gray-600 leading-relaxed">{text}</p>
      </div>
    </div>
  );
}