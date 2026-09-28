import { describe, it, expect } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import { ProductCard, ProductCardSkeleton } from './ProductCard';

describe('ProductCard', () => {
  it('renders name and brand', () => {
    render(<ProductCard name="Panel LED 48W" brand="Macroled" price={14990} />);
    expect(screen.getByText('Panel LED 48W')).toBeDefined();
    expect(screen.getByText('Macroled')).toBeDefined();
  });

  it('shows stock indicator', () => {
    render(<ProductCard name="Test" price={100} stock="low" />);
    expect(screen.getByText('Últimas unidades')).toBeDefined();
  });

  it('shows old price and discount', () => {
    render(<ProductCard name="Test" price={14990} oldPrice={17900} discount="-16%" />);
    const old = screen.getByText((c) => c.includes('17.900'));
    expect(old.className).toContain('line-through');
    expect(screen.getByText('-16%')).toBeDefined();
  });

  it('renders badge slot', () => {
    render(<ProductCard name="Test" price={100} badge={<span data-testid="badge">OFERTA</span>} />);
    expect(screen.getByTestId('badge')).toBeDefined();
  });

  it('renders action slot', () => {
    render(<ProductCard name="Test" price={100} action={<button>Agregar</button>} />);
    expect(screen.getByText('Agregar')).toBeDefined();
  });

  it('renders priceNote and installments inside the card', () => {
    const { container } = render(
      <ProductCard
        name="Test"
        price={100}
        priceNote={<span data-testid="nota">PRECIO SIN IMPUESTOS NACIONALES $82,64</span>}
        installments={<span data-testid="cuotas">Hasta 3 cuotas de $33,33</span>}
      />,
    );
    const card = container.firstElementChild as HTMLElement;
    expect(card.contains(screen.getByTestId('nota'))).toBe(true);
    expect(card.contains(screen.getByTestId('cuotas'))).toBe(true);
  });

  it('omits the priceNote / installments wrappers when not provided', () => {
    const { container } = render(<ProductCard name="Test" price={100} />);
    expect(container.querySelector('.text-\\[11px\\]')).toBeNull();
  });

  it('formats prices with cents and keeps round prices clean', () => {
    render(<ProductCard name="Test" price={713028.8} oldPrice={14990} />);
    expect(screen.getByText((c) => c.includes('713.028,80'))).toBeDefined();
    expect(screen.getByText((c) => c.includes('14.990') && !c.includes('14.990,00'))).toBeDefined();
  });
});

describe('variant editorial', () => {
  it('aplica la card editorial: radius 20px y sombra elevada', () => {
    const { container } = render(<ProductCard variant="editorial" name="Panel LED" price={1000} />);
    expect((container.firstElementChild as HTMLElement).className).toContain('rounded-[20px]');
  });

  it('precio en tipografía display serif, responsive con la escala (sin text-[22px])', () => {
    render(<ProductCard variant="editorial" name="Panel LED" price={1000} />);
    const precio = screen.getByText(/\$|1\.000/);
    expect(precio.className).toContain('font-display');
    expect(precio.className).toContain('text-xl');
    expect(precio.className).toContain('md:text-2xl');
    expect(precio.className).not.toContain('text-[22px]');
  });

  it('muestra el indicador de stock por defecto (0.12.0)', () => {
    render(<ProductCard variant="editorial" name="Panel LED" price={1000} stock="in" />);
    expect(screen.getByText('En stock')).toBeInTheDocument();
  });

  it('con showStock={false} no muestra el indicador', () => {
    render(<ProductCard variant="editorial" name="Panel LED" price={1000} stock="in" showStock={false} />);
    expect(screen.queryByText('En stock')).toBeNull();
  });

  it('la variant default sigue mostrando stock (regresión)', () => {
    render(<ProductCard name="Panel LED" price={1000} stock="in" />);
    expect(screen.getByText('En stock')).toBeInTheDocument();
  });
});

describe('code, stock label y layout', () => {
  it('code renderiza "Cód. 02141N" chico y muted; codeLabel es configurable', () => {
    const { rerender } = render(<ProductCard name="Test" price={100} code="02141N" />);
    const cod = screen.getByText('Cód. 02141N');
    expect(cod.className).toContain('text-xs');
    expect(cod.className).toContain('text-muted');
    rerender(<ProductCard name="Test" price={100} code="02141N" codeLabel="SKU" />);
    expect(screen.getByText('SKU 02141N')).toBeInTheDocument();
  });

  it('sin code no existe la línea', () => {
    render(<ProductCard name="Test" price={100} />);
    expect(screen.queryByText(/Cód\./)).toBeNull();
  });

  it('stockLabel libre en low va en text-warning', () => {
    render(<ProductCard variant="editorial" name="Test" price={100} stock="low" stockLabel="¡Últimas 3!" />);
    expect(screen.getByText('¡Últimas 3!').closest('span')?.className).toContain('text-warning');
  });

  it('layout grid por defecto: data-layout="grid", imagen cuadrada y nombre con dos líneas reservadas', () => {
    const { container } = render(<ProductCard name="Test" price={100} />);
    const root = container.firstElementChild as HTMLElement;
    expect(root).toHaveAttribute('data-layout', 'grid');
    expect(root.className).toContain('flex-col');
    expect(root.querySelector('.aspect-square')).not.toBeNull();
    const h3 = screen.getByRole('heading', { level: 3 });
    expect(h3.className).toContain('line-clamp-2');
    expect(h3.className).toContain('min-h-10');
  });

  it('layout list: raíz flex-row y la imagen con ancho fijo en vez de aspect-square', () => {
    const { container } = render(<ProductCard name="Test" price={100} layout="list" />);
    const root = container.firstElementChild as HTMLElement;
    expect(root).toHaveAttribute('data-layout', 'list');
    expect(root.className).toContain('flex-row');
    const img = root.firstElementChild as HTMLElement;
    expect(img.className).toContain('w-32');
    expect(img.className).toContain('sm:w-40');
    expect(img.className).toContain('shrink-0');
    expect(img.className).not.toContain('aspect-square');
  });
});

describe('href (stretched link)', () => {
  it('con href el nombre es un enlace que cubre la card y el action queda fuera del <a>', () => {
    render(<ProductCard name="Lámpara" price={100} href="/producto/1" action={<button>Agregar</button>} />);
    const link = screen.getByRole('link', { name: 'Lámpara' });
    expect(link).toHaveAttribute('href', '/producto/1');
    expect(link.className).toContain('after:absolute');
    expect(link.className).toContain('after:inset-0');
    expect(screen.getByRole('button', { name: 'Agregar' }).closest('a')).toBeNull();
    expect(screen.getByRole('button', { name: 'Agregar' }).parentElement?.className).toContain('z-10');
  });

  it('sin href el nombre no es enlace', () => {
    render(<ProductCard name="Lámpara" price={100} />);
    expect(screen.queryByRole('link')).toBeNull();
  });

  it('renderLink recibe href, className y children', () => {
    render(
      <ProductCard
        name="Lámpara"
        price={100}
        href="/producto/1"
        renderLink={({ href, className, children }) => (
          <a href={href} className={className} data-next>
            {children}
          </a>
        )}
      />,
    );
    const link = screen.getByRole('link', { name: 'Lámpara' });
    expect(link).toHaveAttribute('data-next');
    expect(link.className).toContain('after:inset-0');
  });
});

describe('ProductCardSkeleton', () => {
  it('es aria-hidden, no tiene texto legible y se compone de Skeleton', () => {
    const { container } = render(<ProductCardSkeleton layout="grid" />);
    const root = container.firstElementChild as HTMLElement;
    expect(root).toHaveAttribute('aria-hidden', 'true');
    expect(root.textContent?.trim()).toBe('');
    expect(root).toHaveAttribute('data-layout', 'grid');
    expect(root.querySelectorAll('.animate-pulse').length).toBeGreaterThanOrEqual(4);
    expect(root.querySelector('.aspect-square')).not.toBeNull();
  });

  it('layout list respeta el ancho de imagen', () => {
    const { container } = render(<ProductCardSkeleton layout="list" variant="editorial" />);
    const root = container.firstElementChild as HTMLElement;
    expect(root).toHaveAttribute('data-layout', 'list');
    expect(root.className).toContain('flex-row');
    expect((root.firstElementChild as HTMLElement).className).toContain('w-32');
  });
});

describe('cornerAction', () => {
  const corazon = <button aria-label="Guardar en favoritos" />;

  it('se renderiza en la esquina superior derecha por encima del enlace estirado', () => {
    render(<ProductCard name="Lámpara LED" price={100} cornerAction={corazon} />);
    const boton = screen.getByRole('button', { name: 'Guardar en favoritos' });
    const wrap = boton.parentElement as HTMLElement;
    expect(wrap.className).toContain('absolute');
    expect(wrap.className).toContain('right-2');
    expect(wrap.className).toContain('top-2');
    expect(wrap.className).toContain('z-10');
  });

  it('convive con badge (badge a la izquierda, acción a la derecha)', () => {
    render(
      <ProductCard name="Lámpara LED" price={100} badge={<span data-testid="badge">Nuevo</span>} cornerAction={corazon} />,
    );
    expect(screen.getByTestId('badge').parentElement?.className).toContain('left-2');
    expect(screen.getByRole('button', { name: 'Guardar en favoritos' }).parentElement?.className).toContain('right-2');
  });

  it('con href el botón del slot no queda dentro del <a>', () => {
    render(<ProductCard name="Lámpara LED" price={100} href="/producto/42" cornerAction={corazon} />);
    expect(screen.getByRole('link', { name: 'Lámpara LED' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Guardar en favoritos' }).closest('a')).toBeNull();
  });

  it('en layout list mantiene data-layout y el slot sigue en el wrapper de imagen', () => {
    const { container } = render(
      <ProductCard name="Lámpara LED" price={100} layout="list" image={<img alt="" data-testid="img" />} cornerAction={corazon} />,
    );
    expect(container.firstElementChild).toHaveAttribute('data-layout', 'list');
    const imgWrap = screen.getByTestId('img').parentElement as HTMLElement;
    expect(imgWrap.contains(screen.getByRole('button', { name: 'Guardar en favoritos' }))).toBe(true);
  });

  it('sin cornerAction no agrega el wrapper', () => {
    const { container } = render(<ProductCard name="Lámpara LED" price={100} />);
    expect(container.querySelector('.right-2.top-2')).toBeNull();
  });
});

describe('fila de precio y acción', () => {
  it('se parte en dos líneas cuando la acción no entra al lado del precio', () => {
    render(<ProductCard name="Lámpara" price={2566938.53} action={<button>Agregar</button>} />);
    const accion = screen.getByRole('button', { name: 'Agregar' }).parentElement!;
    const fila = accion.parentElement!;
    // La fila puede partirse: si el precio largo y el stepper no entran juntos,
    // la acción baja a su propia línea en vez de montarse sobre el precio.
    expect(fila.className).toContain('flex-wrap');
    // El precio no se achica por debajo de su ancho: es lo que forzaba el solapamiento.
    const precio = fila.firstElementChild as HTMLElement;
    expect(precio.className).not.toContain('min-w-0');
    // La acción queda a la derecha también cuando baja de línea.
    expect(accion.className).toContain('ml-auto');
  });

  it('actionPlacement="below": la acción va siempre en su propia línea, sin depender del precio', () => {
    render(<ProductCard name="Lámpara" price={538} actionPlacement="below" action={<button>Agregar</button>} />);
    const accion = screen.getByRole('button', { name: 'Agregar' }).parentElement!;
    const fila = accion.parentElement!;
    expect(fila.className).toContain('flex-col');
    expect(fila.className).not.toContain('flex-wrap');
    expect(accion.className).toContain('self-end');
  });
});

describe('images (galería)', () => {
  const fotos = [<img key="a" alt="Foto 1" />, <img key="b" alt="Foto 2" />, <img key="c" alt="Foto 3" />];

  it('con una sola foto no arma galería', () => {
    const { container } = render(<ProductCard name="Test" price={100} images={[<img key="a" alt="Única" />]} />);
    expect(screen.getByAltText('Única')).toBeInTheDocument();
    expect(container.querySelector('[data-galeria]')).toBeNull();
  });

  it('monta sólo la primera foto hasta que la persona se acerca a la card', () => {
    const { container } = render(<ProductCard name="Test" price={100} images={fotos} />);
    expect(container.querySelectorAll('[data-foto]')).toHaveLength(3);
    expect(screen.getByAltText('Foto 1')).toBeInTheDocument();
    expect(screen.queryByAltText('Foto 2')).toBeNull();
    fireEvent.pointerEnter(container.querySelector('[data-galeria]') as HTMLElement);
    expect(screen.getByAltText('Foto 2')).toBeInTheDocument();
    expect(screen.queryByAltText('Foto 3')).toBeNull();
  });

  it('con href cada foto abre la ficha, fuera del tab y del lector; el enlace accesible sigue siendo el nombre', () => {
    const { container } = render(<ProductCard name="Lámpara" price={100} href="/producto/1" images={fotos} />);
    const enlacesFoto = container.querySelectorAll('[data-foto] a');
    expect(enlacesFoto).toHaveLength(3);
    enlacesFoto.forEach((a) => {
      expect(a).toHaveAttribute('href', '/producto/1');
      expect(a).toHaveAttribute('tabindex', '-1');
      expect(a).toHaveAttribute('aria-hidden', 'true');
    });
    expect(screen.getAllByRole('link')).toHaveLength(1);
  });

  it('en la primera foto no hay flecha "anterior" y sí "siguiente"', () => {
    render(<ProductCard name="Test" price={100} images={fotos} />);
    expect(screen.queryByRole('button', { name: 'Foto anterior' })).toBeNull();
    expect(screen.getByRole('button', { name: 'Foto siguiente' })).toBeInTheDocument();
  });
});

describe('variant soft (0.37.0)', () => {
  it('card sin borde (filo de ring muy tenue) y la foto a sangre sobre un fondo neutro sutil', () => {
    const { container } = render(<ProductCard variant="soft" name="Amplificador RGB" price={16395.11} image={<img alt="" />} />);
    const raiz = container.firstElementChild as HTMLElement;
    expect(raiz.className).not.toMatch(/(^|\s)border(\s|$)/);
    expect(raiz.className).toContain('ring-1');
    // A sangre: sin padding en la card (quedaba un marco blanco alrededor de la foto) y la
    // card recorta las esquinas de la foto.
    expect(raiz.className).not.toMatch(/(^|\s)p-2(\s|$)/);
    expect(raiz.className).toContain('overflow-hidden');
    const foto = raiz.firstElementChild as HTMLElement;
    // No bg-elevated: en temas de color ese rol es un tinte (ver comentario de imageWrap).
    expect(foto.className).toContain('bg-text/[0.03]');
    expect(foto.className).not.toMatch(/rounded-\[/);
    expect(foto.className).not.toContain('border-b');
  });

  it('el nombre no reserva dos líneas: el precio ya se alinea desde abajo', () => {
    render(<ProductCard variant="soft" name="Aceitera: 500ml" price={100} />);
    expect(screen.getByRole('heading').className).not.toContain('min-h');
  });

  it('la marca va como texto normal, sin mayúsculas sostenidas', () => {
    render(<ProductCard variant="soft" name="Amplificador RGB" brand="Macroled" price={100} />);
    expect(screen.getByText('Macroled').className).not.toContain('uppercase');
  });

  it('precio con centavos chicos; el lector de pantalla lee el precio entero', () => {
    const { container } = render(<ProductCard variant="soft" name="AR111" price={15373.2} />);
    const visible = container.querySelector('[data-precio]') as HTMLElement;
    expect(visible).toHaveAttribute('aria-hidden', 'true');
    expect(visible.querySelector('[data-centavos]')!.textContent).toBe('20');
    expect(screen.getByText((c, el) => el?.className.includes('sr-only') === true && c.includes('15.373,20'))).toBeInTheDocument();
  });

  it('precio redondo: sin centavos', () => {
    const { container } = render(<ProductCard variant="soft" name="AR111" price={14990} />);
    expect(container.querySelector('[data-centavos]')).toBeNull();
  });

  it('el stock va en la fila del precio desde sm; en mobile, arriba del precio (los precios de una fila quedan alineados)', () => {
    render(<ProductCard variant="soft" name="AR111" price={100} stock="low" stockLabel="Quedan 3" />);
    const [arriba, enFila] = screen.getAllByText('Quedan 3');
    expect(arriba.closest('[data-fila-precio]')).toBeNull();
    expect(arriba.parentElement!.className).toContain('sm:hidden');
    expect(enFila.closest('[data-fila-precio]')).not.toBeNull();
    expect(enFila.parentElement!.className).toContain('hidden sm:inline');
  });

  it('la acción va abajo y a todo el ancho', () => {
    render(<ProductCard variant="soft" name="AR111" price={100} action={<button>Agregar</button>} />);
    const accion = screen.getByRole('button', { name: 'Agregar' }).parentElement!;
    expect(accion.className).toContain('w-full');
  });

  it('layout list: la foto se estira al alto de la fila, con un mínimo', () => {
    const { container } = render(<ProductCard variant="soft" layout="list" name="AR111" price={100} image={<img alt="" />} />);
    const foto = container.firstElementChild!.firstElementChild as HTMLElement;
    expect(foto.className).toContain('self-stretch');
    expect(foto.className).toContain('min-h-26');
    expect(foto.className).not.toContain('aspect-square');
  });

  it('hover suave: refuerza el filo y una sombra mínima, sin la elevación de shadow-2', () => {
    const { container } = render(<ProductCard variant="soft" name="AR111" price={100} />);
    const raiz = container.firstElementChild as HTMLElement;
    expect(raiz.className).not.toContain('hover:shadow-2');
    expect(raiz.className).toContain('hover:shadow-1');
    expect(raiz.className).toContain('hover:ring-border');
  });

  it('editorial no cambia (regresión)', () => {
    const { container } = render(<ProductCard variant="editorial" name="AR111" brand="Macroled" price={15373.2} />);
    expect(container.firstElementChild!.className).toContain('rounded-[20px]');
    expect(screen.getByText('Macroled').className).toContain('uppercase');
    expect(container.querySelector('[data-precio]')).toBeNull();
  });
});
