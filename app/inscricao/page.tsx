'use client';

import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useState } from 'react';

const jogadorSchema = z.object({
  nome: z.string().min(1),
  posicao: z.string().min(1),
  numero: z.coerce.number().int().positive(),
});

const schema = z.object({
  nome: z.string().min(1, 'Nome do time é obrigatório'),
  contato: z.string().min(1, 'Contato é obrigatório'),
  capitao: z.string().min(1, 'Capitão é obrigatório'),
  aceiteRegulamento: z.literal(true, {
    errorMap: () => ({ message: 'Você precisa aceitar o regulamento' }),
  }),
  jogadores: z.array(jogadorSchema).min(1, 'Adicione pelo menos 1 jogador'),
});

type FormData = z.infer<typeof schema>;

export default function InscricaoPage() {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      jogadores: [{ nome: '', posicao: '', numero: 0 }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'jogadores',
  });

  const [mensagem, setMensagem] = useState<string | null>(null);

  const onSubmit = async (data: FormData) => {
    const res = await fetch('/api/inscricao', {
      method: 'POST',
      body: JSON.stringify(data),
    });

    if (res.ok) {
      setMensagem('Inscrição enviada com sucesso!');
    } else {
      const json = await res.json();
      setMensagem('Erro: ' + JSON.stringify(json.error));
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Inscrição de Equipe</h1>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <input
          {...register('nome')}
          placeholder="Nome do time"
          className="input"
        />
        <p className="text-red-500 text-sm">{errors.nome?.message}</p>

        <input
          {...register('capitao')}
          placeholder="Capitão"
          className="input"
        />
        <p className="text-red-500 text-sm">{errors.capitao?.message}</p>

        <input
          {...register('contato')}
          placeholder="Contato"
          className="input"
        />
        <p className="text-red-500 text-sm">{errors.contato?.message}</p>

        <div>
          <h2 className="font-semibold mt-4 mb-2">Jogadores</h2>

          {fields.map((field, index) => (
            <div key={field.id} className="flex gap-2 mb-2">
              <input
                {...register(`jogadores.${index}.nome`)}
                placeholder="Nome"
                className="input flex-1"
              />
              <input
                {...register(`jogadores.${index}.posicao`)}
                placeholder="Posição"
                className="input flex-1"
              />
              <input
                {...register(`jogadores.${index}.numero`)}
                placeholder="Número"
                type="number"
                className="input w-24"
              />
              <button
                type="button"
                onClick={() => remove(index)}
                className="text-red-500 font-bold"
              >
                X
              </button>
            </div>
          ))}

          <button
            type="button"
            onClick={() => append({ nome: '', posicao: '', numero: 0 })}
            className="btn mt-2"
          >
            + Adicionar Jogador
          </button>

          <p className="text-red-500 text-sm">{errors.jogadores?.message}</p>
        </div>

        <label className="flex items-center gap-2">
          <input type="checkbox" {...register('aceiteRegulamento')} />
          <span>Li e aceito o regulamento oficial</span>
        </label>
        <p className="text-red-500 text-sm">
          {errors.aceiteRegulamento?.message}
        </p>

        <button type="submit" className="btn-primary">
          Enviar Inscrição
        </button>
      </form>

      {mensagem && <p className="mt-4 font-medium">{mensagem}</p>}
    </div>
  );
}
