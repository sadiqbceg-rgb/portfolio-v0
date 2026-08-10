'use client';

import { useState } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { Eyebrow } from './Eyebrow';
import { TextReveal } from './TextReveal';
import { useScene, useSceneRange } from './ScrollScene';
import { contact, identity } from '@/content/site';

type Status = 'idle' | 'sending' | 'sent' | 'error';

/* ============================================================================
 * CONTACT — the closing CTA.
 *
 * The reference ends on one oversized line, one button and a radial glow, with
 * everything else stripped away. That single-focus quality is most of the
 * emotional effect, so the header here is deliberately spare: a bracketed
 * eyebrow, the heading, and a glow that grows as the section arrives.
 *
 * A form that silently swallows messages is worse than no form, so the form
 * only renders once `contact.formEndpoint` is set. Until then this section
 * shows a direct email card instead.
 *
 * The earlier version rendered the form anyway, greyed out, above a line of
 * text telling the reader to go and edit `src/content/site.ts`. That is a
 * message to the site's author printed on the site's public page, and the
 * reader it reached was a recruiter looking at a dead contact form. The
 * fallback below is aimed at the visitor: it gives them a working way to make
 * contact, which is all this section owes them.
 * ==========================================================================*/

export function Contact() {
  const [status, setStatus] = useState<Status>('idle');
  const reduced = useReducedMotion();
  const live = Boolean(contact.formEndpoint);

  const scene = useScene(['start end', 'center center']);
  const glowScale = useSceneRange(scene, [0, 1], [0.85, 1], 1);
  const glowOpacity = useSceneRange(scene, [0, 1], [0, 1], 1);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!live) return;

    const form = event.currentTarget;
    setStatus('sending');

    try {
      const response = await fetch(contact.formEndpoint, {
        method: 'POST',
        headers: { Accept: 'application/json' },
        body: new FormData(form),
      });
      if (!response.ok) throw new Error(`Request failed: ${response.status}`);
      form.reset();
      setStatus('sent');
    } catch {
      setStatus('error');
    }
  }

  return (
    <section
      id="contact"
      ref={scene.ref}
      className="relative overflow-hidden py-section-lg"
    >
      <motion.div
        aria-hidden="true"
        style={{ scale: glowScale, opacity: glowOpacity }}
        className="glow-radial pointer-events-none absolute inset-0 -z-10"
      />

      <div className="shell flex flex-col gap-12">
        <header className="flex flex-col items-center gap-6 text-center">
          <Eyebrow>Ready</Eyebrow>
          <TextReveal
            as="h2"
            className="font-control-tnt text-heading-lg text-whiteout max-w-[18ch] text-balance"
            lines={[contact.title]}
          />
          <p className="prose-longform text-body max-w-[56ch] text-whiteout/65">
            {contact.subtitle}
          </p>
        </header>

        {/* Two layouts, because the two states want different shapes. With a
            form there is enough substance for a panel beside a rail. Without
            one, the same panel is a large pale box holding one button — so the
            fallback centres the call to action under the heading instead, and
            lets the links sit beneath it. */}
        <div
          className={
            live
              ? 'grid grid-cols-1 gap-10 md:grid-cols-[minmax(0,1fr)_18rem] md:items-start'
              : 'flex flex-col items-center gap-12'
          }
        >
          {live ? (
            <div className="card-haze">
              <form onSubmit={onSubmit} className="flex flex-col gap-4">
                <fieldset className="flex flex-col gap-4">
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <label className="flex flex-col gap-2">
                      <span className="text-caption text-ink/70">Name</span>
                      <input
                        className="input"
                        type="text"
                        name="name"
                        required
                        autoComplete="name"
                        placeholder="Ada Lovelace"
                      />
                    </label>

                    <label className="flex flex-col gap-2">
                      <span className="text-caption text-ink/70">Email</span>
                      <input
                        className="input"
                        type="email"
                        name="email"
                        required
                        autoComplete="email"
                        placeholder="ada@example.com"
                      />
                    </label>
                  </div>

                  <label className="flex flex-col gap-2">
                    <span className="text-caption text-ink/70">Message</span>
                    <textarea
                      className="input min-h-32 resize-y"
                      name="message"
                      required
                      rows={5}
                      placeholder="What are you working on?"
                    />
                  </label>

                  <div className="flex flex-wrap items-center gap-4">
                    <button type="submit" className="btn-haze group">
                      {status === 'sending' ? 'Sending…' : 'Send message'}
                      <span
                        aria-hidden="true"
                        className="ml-1 inline-block transition-transform duration-200 group-hover:translate-x-1"
                      >
                        →
                      </span>
                    </button>

                    <p aria-live="polite" className="text-caption text-ink/70">
                      {status === 'sent'
                        ? 'Thanks — I will get back to you.'
                        : status === 'error'
                          ? 'Something went wrong. Email me instead.'
                          : ''}
                    </p>
                  </div>
                </fieldset>
              </form>
            </div>
          ) : (
            <a
              href={`mailto:${identity.email}`}
              className="btn-haze group text-body px-8 py-4"
            >
              {identity.email}
              <span
                aria-hidden="true"
                className="ml-2 inline-block transition-transform duration-200 group-hover:translate-x-1"
              >
                →
              </span>
            </a>
          )}

          <motion.div
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '0px 0px -15% 0px' }}
            transition={{
              duration: reduced ? 0 : 0.6,
              ease: [0.22, 1, 0.36, 1],
            }}
            className={
              live
                ? 'flex h-fit flex-col gap-4 border-t hairline pt-6'
                : 'flex w-full max-w-md flex-col items-center gap-4 border-t hairline pt-6'
            }
          >
            {/* The email is repeated in this rail only when the form is the
                primary action. In the fallback the button above already is
                the email, so listing it again directly beneath would be
                the same link twice in a row. */}
            {live ? (
              <>
                <Eyebrow bracketed={false}>Direct</Eyebrow>
                <a
                  href={`mailto:${identity.email}`}
                  className="link-underline self-start text-body"
                >
                  {identity.email}
                </a>
              </>
            ) : null}

            <Eyebrow bracketed={false} className={live ? 'pt-4' : undefined}>
              Elsewhere
            </Eyebrow>
            <ul
              className={
                live
                  ? 'flex flex-col items-start gap-3'
                  : 'flex flex-wrap justify-center gap-x-6 gap-y-3'
              }
            >
              {contact.socials.map((social) => (
                <li key={social.label}>
                  <a
                    href={social.href}
                    target="_blank"
                    rel="noreferrer"
                    className="link-underline group text-body"
                  >
                    {social.label}
                    <span
                      aria-hidden="true"
                      className="ml-1 inline-block transition-transform duration-200 group-hover:translate-x-1"
                    >
                      ↗
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
