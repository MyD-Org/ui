import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Tooltip } from './Tooltip';

describe('Tooltip', () => {
  it('no muestra el contenido hasta hacer hover', () => {
    render(
      <Tooltip content="Info">
        <button>Hover me</button>
      </Tooltip>,
    );
    expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
  });

  it('muestra el contenido al hacer focus en el trigger', async () => {
    const user = userEvent.setup();
    render(
      <Tooltip content="Info" delayMs={0}>
        <button>Hover me</button>
      </Tooltip>,
    );
    await user.tab();
    expect(await screen.findByRole('tooltip')).toHaveTextContent('Info');
  });
});
