import { Section, SectionHeading } from '@/components/Section'
import { Timeline } from '@/components/ui/timeline'
import { schedule } from '@/data/schedule.js'
import { sections } from '@/data/site.js'

/**
 * The programme, as a timeline: the day sticks on the left in giant outline type while
 * its entries scroll past. Everything shown comes from src/data/schedule.js.
 */
export function Schedule() {
  const copy = sections.schedule

  return (
    <Section id="schedule" tone="cream" noise labelledBy="schedule-title">
      <SectionHeading
        id="schedule-title"
        number="03"
        label={copy.label}
        lead={copy.lead}
        accent={copy.accent}
      />

      <div className="px-1 md:px-6">
        <Timeline
          titleClassName="text-4xl md:text-[clamp(3.5rem,8vw,8rem)] leading-[0.9] font-black tracking-[-0.04em] uppercase text-outline"
          data={schedule.map((day) => ({
            title: day.day,
            content: (
              <div>
                <p className="label text-fg-muted">{day.date}</p>
                <ol className="mt-4 border-t border-line">
                  {day.items.map((item, index) => (
                    <li
                      key={`${item.title}-${index}`}
                      className="flex items-baseline justify-between gap-6 border-b border-line py-5 md:py-6"
                    >
                      <span className="text-2xl leading-none font-extrabold tracking-[-0.03em] uppercase md:text-4xl">
                        {item.title}
                      </span>
                      <span className="label shrink-0 text-fg-muted">{item.time}</span>
                    </li>
                  ))}
                </ol>
              </div>
            ),
          }))}
        />
      </div>

      <p className="px-5 pb-20 text-fg-muted md:px-10 md:pb-28">{copy.note}</p>
    </Section>
  )
}
