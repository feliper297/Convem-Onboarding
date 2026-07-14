import ProgressBar from './ProgressBar';

export default {
  title: 'Components/ProgressBar',
  component: ProgressBar,
  tags: ['autodocs'],
  argTypes: {
    value: { control: { type: 'range', min: 0, max: 100, step: 1 } },
    color: { control: 'color' },
    track: { control: 'color' },
    height: { control: { type: 'number', min: 4, max: 16, step: 1 } },
  },
  decorators: [
    (Story) => (
      <div className="w-80">
        <Story />
      </div>
    ),
  ],
};

export const Default = {
  args: {
    value: 65,
  },
};

export const Completo = {
  args: {
    value: 100,
    color: '#0E7C66',
  },
};

export const Vazio = {
  args: {
    value: 0,
  },
};

export const PorProjeto = {
  render: () => (
    <div className="flex flex-col gap-4 w-80">
      <div>
        <p className="text-xs text-ink-secondary mb-1.5">APP Banking — 75%</p>
        <ProgressBar value={75} color="#0E7C66" />
      </div>
      <div>
        <p className="text-xs text-ink-secondary mb-1.5">Tupi — 40%</p>
        <ProgressBar value={40} color="#2754C5" />
      </div>
      <div>
        <p className="text-xs text-ink-secondary mb-1.5">Convem Board — 90%</p>
        <ProgressBar value={90} color="#B45309" />
      </div>
      <div>
        <p className="text-xs text-ink-secondary mb-1.5">Reg+ — 25%</p>
        <ProgressBar value={25} color="#6E3AAE" />
      </div>
    </div>
  ),
};
