import { useState } from 'react';
import { Field, FInput } from '../../components/crud';

export default {
  title: 'Patterns/Formulário',
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: 'Padrão de campo com label (`Field`) e input (`FInput`) usado em modais CRUD do portal.',
      },
    },
  },
};

export const CampoTexto = {
  render: function CampoTextoStory() {
    const [value, setValue] = useState('');

    return (
      <div className="w-80">
        <Field label="Nome completo" required>
          <FInput
            value={value}
            onChange={setValue}
            placeholder="Digite o nome"
          />
        </Field>
      </div>
    );
  },
};

export const CampoEmail = {
  render: function CampoEmailStory() {
    const [value, setValue] = useState('colaborador@empresa.com');

    return (
      <div className="w-80">
        <Field label="E-mail corporativo" required>
          <FInput
            type="email"
            value={value}
            onChange={setValue}
            placeholder="seu.email@empresa.com"
          />
        </Field>
      </div>
    );
  },
};

export const FormularioSimples = {
  render: function FormularioSimplesStory() {
    const [nome, setNome] = useState('');
    const [email, setEmail] = useState('');

    return (
      <div className="w-80 flex flex-col gap-4 p-6 rounded-lg bg-surface border border-border">
        <Field label="Nome" required>
          <FInput value={nome} onChange={setNome} placeholder="Seu nome" />
        </Field>
        <Field label="E-mail" required>
          <FInput
            type="email"
            value={email}
            onChange={setEmail}
            placeholder="seu@empresa.com"
          />
        </Field>
      </div>
    );
  },
};
