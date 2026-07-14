import { FileQuestion, Inbox, Users } from 'lucide-react';
import EmptyState from './EmptyState';

export default {
  title: 'Components/EmptyState',
  component: EmptyState,
  tags: ['autodocs'],
  argTypes: {
    title: { control: 'text' },
    description: { control: 'text' },
  },
  decorators: [
    (Story) => (
      <div className="w-full max-w-md">
        <Story />
      </div>
    ),
  ],
};

export const Default = {
  args: {
    title: 'Nenhum item encontrado',
    description: 'Adicione o primeiro registro para começar a preencher esta seção.',
  },
};

export const SemDescricao = {
  args: {
    title: 'Lista vazia',
  },
};

export const Glossario = {
  args: {
    icon: FileQuestion,
    title: 'Nenhum termo cadastrado',
    description: 'Adicione termos ao glossário para ajudar novos membros do time.',
  },
};

export const Time = {
  args: {
    icon: Users,
    title: 'Time ainda não documentado',
    description: 'Cadastre os membros e suas especialidades neste projeto.',
  },
};

export const CustomIcon = {
  args: {
    icon: Inbox,
    title: 'Caixa de entrada vazia',
    description: 'Quando houver novidades, elas aparecerão aqui.',
  },
};
