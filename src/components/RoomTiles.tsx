import { type HTMLAttributes } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../lib/cn';

export interface RoomTile {
  eyebrow: string;
  title: string;
  imageSrc: string;
  imageAlt?: string;
  href: string;
}

const tile = cva(
  'group relative isolate flex items-end overflow-hidden rounded-[24px]',
  {
    variants: {
      variant: {
        mosaic: 'min-h-[300px] lg:min-h-[220px]',
        grid: 'min-h-[240px] lg:min-h-0 lg:aspect-[1/1.25]',
      },
    },
    defaultVariants: { variant: 'mosaic' },
  },
);

export interface RoomTilesProps extends HTMLAttributes<HTMLDivElement>, VariantProps<typeof tile> {
  items: RoomTile[];
}

export function RoomTiles({ items, variant, className, ...props }: RoomTilesProps) {
  const esMosaic = variant !== 'grid';
  return (
    <div
      className={cn(
        'grid gap-5',
        esMosaic ? 'lg:grid-cols-[1.25fr_1fr]' : 'grid-cols-2 lg:grid-cols-4',
        className,
      )}
      {...props}
    >
      {items.map((item, i) => (
        <a
          key={item.href + item.title}
          href={item.href}
          data-size={i === 0 && esMosaic ? 'big' : undefined}
          className={cn(
            tile({ variant }),
            i === 0 && esMosaic && 'lg:row-span-2 lg:min-h-[460px]',
          )}
        >
          <img
            src={item.imageSrc}
            alt={item.imageAlt ?? ''}
            className="absolute inset-0 -z-20 h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.045]"
          />
          <div className="absolute inset-0 -z-10 bg-[linear-gradient(to_top,rgba(30,22,14,0.62)_0%,rgba(30,22,14,0.12)_45%,transparent_70%)]" />
          <div className="p-[clamp(22px,2.5vw,34px)]">
            <small className="mb-2 block text-[11px] font-extrabold uppercase tracking-[0.2em] text-highlight">
              {item.eyebrow}
            </small>
            <h3 className="font-display text-[clamp(24px,2.4vw,34px)] font-medium leading-[1.1] text-white">
              {item.title}
            </h3>
            {esMosaic ? (
              <span className="mt-3.5 inline-flex items-center gap-2 border-b-[1.5px] border-white/50 pb-[3px] text-[13px] font-extrabold text-white transition-[border-color,gap] duration-200 group-hover:border-highlight group-hover:gap-3">
                Explorar →
              </span>
            ) : null}
          </div>
          {!esMosaic ? (
            <span
              data-go
              className="absolute bottom-5 right-5 flex h-[34px] w-[34px] items-center justify-center rounded-full bg-surface text-base text-text transition-[background-color,transform] duration-300 group-hover:-rotate-45 group-hover:bg-highlight"
              aria-hidden="true"
            >
              →
            </span>
          ) : null}
        </a>
      ))}
    </div>
  );
}
