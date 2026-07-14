BEGIN;
-- ===== Convem Board =====
INSERT INTO public.projects (id, name, tagline, description, color, soft, icon, team_lead, team_size)
VALUES ('convem-board', 'Convem Board', 'Painel de gestão para lojistas parceiros', 'Dashboard web onde lojistas acompanham vendas, conciliação financeira e relacionamento com a operação, centralizando os principais indicadores do negócio.', '#B45309', '#FDF1E3', 'BarChart3', 'Patrícia Anjos', 7)
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, tagline = EXCLUDED.tagline, description = EXCLUDED.description, color = EXCLUDED.color, soft = EXCLUDED.soft, icon = EXCLUDED.icon, team_lead = EXCLUDED.team_lead, team_size = EXCLUDED.team_size, updated_at = now();

INSERT INTO public.project_objectives (project_id, description, order_index) VALUES ('convem-board', 'Reduzir chamados de suporte sobre conciliação em 30%', 0);
INSERT INTO public.project_objectives (project_id, description, order_index) VALUES ('convem-board', 'Aumentar o uso de relatórios exportáveis', 1);
INSERT INTO public.project_objectives (project_id, description, order_index) VALUES ('convem-board', 'Padronizar indicadores entre todos os segmentos de lojista', 2);
INSERT INTO public.project_metrics (project_id, label, target, order_index) VALUES ('convem-board', 'Chamados de suporte sobre conciliação', '-30%', 0);
INSERT INTO public.project_metrics (project_id, label, target, order_index) VALUES ('convem-board', 'Uso de relatórios exportáveis', '+25% ao mês', 1);
INSERT INTO public.project_metrics (project_id, label, target, order_index) VALUES ('convem-board', 'Tempo de atualização dos indicadores', '≤ 1 hora', 2);
INSERT INTO public.project_links (project_id, label, url, order_index) VALUES ('convem-board', 'Repositório principal', '#', 0);
INSERT INTO public.project_links (project_id, label, url, order_index) VALUES ('convem-board', 'Board do projeto', '#', 1);
INSERT INTO public.project_technologies (project_id, name, order_index) VALUES ('convem-board', 'React', 0);
INSERT INTO public.project_technologies (project_id, name, order_index) VALUES ('convem-board', 'TypeScript', 1);
INSERT INTO public.project_technologies (project_id, name, order_index) VALUES ('convem-board', 'Node.js', 2);
INSERT INTO public.project_technologies (project_id, name, order_index) VALUES ('convem-board', 'GraphQL', 3);
INSERT INTO public.project_technologies (project_id, name, order_index) VALUES ('convem-board', 'PostgreSQL', 4);
INSERT INTO public.project_squads (project_id, name, order_index) VALUES ('convem-board', 'Indicadores', 0);
INSERT INTO public.project_squads (project_id, name, order_index) VALUES ('convem-board', 'Conciliação', 1);
INSERT INTO public.trilha_items (project_id, title, order_index) VALUES ('convem-board', 'Conhecer o produto', 0);
INSERT INTO public.trilha_items (project_id, title, order_index) VALUES ('convem-board', 'Instalar ambiente', 1);
INSERT INTO public.trilha_items (project_id, title, order_index) VALUES ('convem-board', 'Configurar acessos', 2);
INSERT INTO public.trilha_items (project_id, title, order_index) VALUES ('convem-board', 'Ler documentação', 3);
INSERT INTO public.trilha_items (project_id, title, order_index) VALUES ('convem-board', 'Assistir vídeos', 4);
INSERT INTO public.trilha_items (project_id, title, order_index) VALUES ('convem-board', 'Realizar treinamento', 5);
INSERT INTO public.trilha_items (project_id, title, order_index) VALUES ('convem-board', 'Fazer exercício prático', 6);
INSERT INTO public.trilha_items (project_id, title, order_index) VALUES ('convem-board', 'Validar conhecimentos', 7);
INSERT INTO public.doc_categories (project_id, name, icon, order_index) VALUES ('convem-board', 'Arquitetura', 'Layers', 0);
INSERT INTO public.doc_categories (project_id, name, icon, order_index) VALUES ('convem-board', 'Regras de negócio', 'ListTree', 1);
INSERT INTO public.doc_categories (project_id, name, icon, order_index) VALUES ('convem-board', 'Fluxos', 'Workflow', 2);
INSERT INTO public.doc_categories (project_id, name, icon, order_index) VALUES ('convem-board', 'Design System', 'Sparkles', 3);
INSERT INTO public.doc_categories (project_id, name, icon, order_index) VALUES ('convem-board', 'APIs', 'Code2', 4);
INSERT INTO public.doc_categories (project_id, name, icon, order_index) VALUES ('convem-board', 'Banco de Dados', 'Database', 5);
INSERT INTO public.doc_categories (project_id, name, icon, order_index) VALUES ('convem-board', 'Padrões de Código', 'FileCode2', 6);
INSERT INTO public.doc_categories (project_id, name, icon, order_index) VALUES ('convem-board', 'Boas práticas', 'ShieldCheck', 7);
INSERT INTO public.documents (project_id, category_id, title, type, url, author)
SELECT 'convem-board', dc.id, 'Visão geral do painel web', 'Diagrama', '#', 'Patrícia Anjos'
FROM public.doc_categories dc WHERE dc.project_id = 'convem-board' AND dc.name = 'Arquitetura';
INSERT INTO public.documents (project_id, category_id, title, type, url, author)
SELECT 'convem-board', dc.id, 'Regras de conciliação financeira', 'Documento', '#', 'Davi Mourão'
FROM public.doc_categories dc WHERE dc.project_id = 'convem-board' AND dc.name = 'Regras de negócio';
INSERT INTO public.documents (project_id, category_id, title, type, url, author)
SELECT 'convem-board', dc.id, 'Componentes web compartilhados', 'Referência', '#', 'Patrícia Anjos'
FROM public.doc_categories dc WHERE dc.project_id = 'convem-board' AND dc.name = 'Design System';
INSERT INTO public.documents (project_id, category_id, title, type, url, author)
SELECT 'convem-board', dc.id, 'Schema GraphQL', 'Referência', '#', 'Patrícia Anjos'
FROM public.doc_categories dc WHERE dc.project_id = 'convem-board' AND dc.name = 'APIs';
INSERT INTO public.documents (project_id, category_id, title, type, url, author)
SELECT 'convem-board', dc.id, 'Checklist de acessibilidade', 'Guia', '#', 'Davi Mourão'
FROM public.doc_categories dc WHERE dc.project_id = 'convem-board' AND dc.name = 'Boas práticas';
INSERT INTO public.glossario (project_id, term, definition) VALUES ('convem-board', 'Settlement', 'Liquidação financeira final de uma transação entre as partes.');
INSERT INTO public.glossario (project_id, term, definition) VALUES ('convem-board', 'Webhook', 'Notificação automática enviada por um sistema quando um evento ocorre.');
INSERT INTO public.glossario (project_id, term, definition) VALUES ('convem-board', 'API', 'Interface que permite a comunicação entre sistemas diferentes.');
INSERT INTO public.team_members (project_id, name, role, area, contact, specialty) VALUES ('convem-board', 'Patrícia Anjos', 'Tech Lead', 'Engenharia', 'patricia.anjos@empresa.com', 'Frontend de dados');
INSERT INTO public.team_members (project_id, name, role, area, contact, specialty) VALUES ('convem-board', 'Davi Mourão', 'Product Manager', 'Produto', 'davi.mourao@empresa.com', 'Experiência do lojista');
INSERT INTO public.stakeholders (project_id, name, role, area, contact, influence, interest, expectativa) VALUES ('convem-board', 'Thiago Corrêa', 'Head de Lojistas', 'Comercial', 'thiago.correa@empresa.com', 'Alto', 'Alto', 'Painel intuitivo que reduza chamados de suporte');
INSERT INTO public.stakeholders (project_id, name, role, area, contact, influence, interest, expectativa) VALUES ('convem-board', 'Priscila Neves', 'Gerente de Conciliação', 'Financeiro', 'priscila.neves@empresa.com', 'Médio', 'Alto', 'Conciliação automática e sem divergências');
INSERT INTO public.stakeholders (project_id, name, role, area, contact, influence, interest, expectativa) VALUES ('convem-board', 'Eduardo Rocha', 'Head de BI', 'Dados', 'eduardo.rocha@empresa.com', 'Médio', 'Médio', 'Padronização de métricas entre segmentos');
INSERT INTO public.reunioes (project_id, name, description, frequency, duration, time, participants, link) VALUES ('convem-board', 'Daily', 'Alinhamento diário de andamento das tasks e bloqueios.', 'Diária', '15 min', '09:00', ARRAY['Devs', 'PO', 'Tech Lead'], 'https://meet.google.com/abc-defg-hij');
INSERT INTO public.reunioes (project_id, name, description, frequency, duration, time, participants, link) VALUES ('convem-board', 'Sprint Planning', 'Definição das entregas do próximo sprint.', 'A cada 2 semanas', '1h30', '10:00 (seg)', ARRAY['Devs', 'PO', 'Tech Lead'], 'https://meet.google.com/abc-defg-hij');
INSERT INTO public.reunioes (project_id, name, description, frequency, duration, time, participants, link) VALUES ('convem-board', 'Sprint Review', 'Apresentação das entregas do sprint para stakeholders.', 'A cada 2 semanas', '1h', '15:00 (sex)', ARRAY['Devs', 'PO', 'Head de Lojistas'], 'https://meet.google.com/abc-defg-hij');
INSERT INTO public.reunioes (project_id, name, description, frequency, duration, time, participants, link) VALUES ('convem-board', 'Retrospectiva', 'Melhoria contínua do processo do time.', 'A cada 2 semanas', '1h', '16:00 (sex)', ARRAY['Time completo'], 'https://meet.google.com/abc-defg-hij');
INSERT INTO public.reunioes (project_id, name, description, frequency, duration, time, participants, link) VALUES ('convem-board', 'Sync BI / Dados', 'Alinhamento de métricas e indicadores com o time de dados.', 'Quinzenal', '45 min', '14:00 (qua)', ARRAY['Dev', 'Head BI'], 'https://meet.google.com/abc-defg-hij');
INSERT INTO public.faq (project_id, category, question, answer, order_index) VALUES ('convem-board', 'Indicadores', 'Com que frequência os dados são atualizados?', 'Os indicadores são recalculados a cada hora.', 0);
INSERT INTO public.operacao_alertas (project_id, nome, severidade, significado, acao) VALUES ('convem-board', 'CONCILIACAO_DIVERGENCIA', 'Alta', 'Divergência detectada entre vendas registradas e repasses efetivados acima de R$ 1.000.', 'Acionar squad de Conciliação via #conciliacao-convem com o relatório de divergência.');
INSERT INTO public.operacao_alertas (project_id, nome, severidade, significado, acao) VALUES ('convem-board', 'DASHBOARD_DATA_STALE', 'Média', 'Dados do painel com mais de 2h sem atualização. Possível falha no pipeline de dados.', 'Verificar jobs do Airflow e logs do serviço de ingestão de dados.');
INSERT INTO public.operacao_alertas (project_id, nome, severidade, significado, acao) VALUES ('convem-board', 'EXPORT_FAILURE', 'Baixa', 'Falha na geração de relatório exportável pelo lojista.', 'Verificar logs do serviço report-generator e queue de jobs de exportação.');
INSERT INTO public.operacao_diagnostico (project_id, step_text, order_index) VALUES ('convem-board', '1. Verificar o status dos jobs de conciliação no painel do Airflow', 0);
INSERT INTO public.operacao_diagnostico (project_id, step_text, order_index) VALUES ('convem-board', '2. Checar logs do serviço de ingestão de dados no Datadog', 1);
INSERT INTO public.operacao_diagnostico (project_id, step_text, order_index) VALUES ('convem-board', '3. Confirmar se a divergência afeta um único lojista ou é sistêmica', 2);
INSERT INTO public.operacao_diagnostico (project_id, step_text, order_index) VALUES ('convem-board', '4. Verificar a integridade dos dados no banco PostgreSQL', 3);
INSERT INTO public.operacao_diagnostico (project_id, step_text, order_index) VALUES ('convem-board', '5. Acionar o time de dados se o pipeline estiver com lag', 4);
INSERT INTO public.operacao_diagnostico (project_id, step_text, order_index) VALUES ('convem-board', '6. Abrir ticket de suporte com CNPJ do lojista afetado para rastreamento', 5);
INSERT INTO public.operacao_contatos (project_id, problema, responsavel, canal, order_index) VALUES ('convem-board', 'Divergência de conciliação', 'Priscila Neves + Squad Conciliação', '#conciliacao-convem', 0);
INSERT INTO public.operacao_contatos (project_id, problema, responsavel, canal, order_index) VALUES ('convem-board', 'Dados desatualizados no painel', 'Patrícia Anjos (Tech Lead)', '#convem-board-dev', 1);
INSERT INTO public.operacao_contatos (project_id, problema, responsavel, canal, order_index) VALUES ('convem-board', 'Falha em exportação de relatório', 'Squad Indicadores', '#squad-indicadores', 2);
INSERT INTO public.operacao_contatos (project_id, problema, responsavel, canal, order_index) VALUES ('convem-board', 'Problemas de acesso do lojista', 'Suporte Convem', '#suporte-convem', 3);
INSERT INTO public.operacao_logs (project_id, sistema, onde, filtro, order_index) VALUES ('convem-board', 'Pipeline de dados (Airflow)', 'Airflow UI → DAGs → convem_ingestion', 'Status failed/upstream_failed nas últimas 6h', 0);
INSERT INTO public.operacao_logs (project_id, sistema, onde, filtro, order_index) VALUES ('convem-board', 'API do painel', 'Datadog → Services → convem-board-api', 'status:error @endpoint:/api/indicadores', 1);
INSERT INTO public.operacao_logs (project_id, sistema, onde, filtro, order_index) VALUES ('convem-board', 'Serviço de exportação', 'Datadog Logs → Index production', 'service:report-generator level:ERROR', 2);
INSERT INTO public.operacao_canais (project_id, nome, plataforma, descricao, order_index) VALUES ('convem-board', '#convem-board-geral', 'Slack', 'Canal principal do time Convem Board.', 0);
INSERT INTO public.operacao_canais (project_id, nome, plataforma, descricao, order_index) VALUES ('convem-board', '#conciliacao-convem', 'Slack', 'Discussões sobre conciliação financeira e divergências.', 1);
INSERT INTO public.operacao_canais (project_id, nome, plataforma, descricao, order_index) VALUES ('convem-board', '#squad-indicadores', 'Slack', 'Time de indicadores e BI.', 2);
INSERT INTO public.operacao_canais (project_id, nome, plataforma, descricao, order_index) VALUES ('convem-board', 'Board Jira Convem', 'Jira', 'Gestão de tarefas e sprints do produto.', 3);
COMMIT;