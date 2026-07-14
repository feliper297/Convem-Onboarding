BEGIN;
-- ===== Tupi =====
INSERT INTO public.projects (id, name, tagline, description, color, soft, icon, team_lead, team_size)
VALUES ('tupi', 'Tupi', 'Maquininha e ecossistema de pagamentos para lojistas', 'Solução de maquininha de cartão (POS) e gestão de recebíveis voltada a pequenos e médios lojistas, com foco em simplicidade na adesão e antecipação de recebíveis.', '#2754C5', '#EAF0FD', 'CreditCard', 'Bruno Salgado', 9)
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, tagline = EXCLUDED.tagline, description = EXCLUDED.description, color = EXCLUDED.color, soft = EXCLUDED.soft, icon = EXCLUDED.icon, team_lead = EXCLUDED.team_lead, team_size = EXCLUDED.team_size, updated_at = now();

INSERT INTO public.project_objectives (project_id, description, order_index) VALUES ('tupi', 'Diminuir o tempo de ativação de uma nova maquininha para menos de 10 minutos', 0);
INSERT INTO public.project_objectives (project_id, description, order_index) VALUES ('tupi', 'Aumentar a adesão à antecipação automática de recebíveis', 1);
INSERT INTO public.project_objectives (project_id, description, order_index) VALUES ('tupi', 'Reduzir o índice de chargebacks indevidos', 2);
INSERT INTO public.project_metrics (project_id, label, target, order_index) VALUES ('tupi', 'Tempo de ativação da maquininha', '< 10 min', 0);
INSERT INTO public.project_metrics (project_id, label, target, order_index) VALUES ('tupi', 'Adesão à antecipação automática', '+15% no semestre', 1);
INSERT INTO public.project_metrics (project_id, label, target, order_index) VALUES ('tupi', 'Índice de chargebacks indevidos', '< 0.3%', 2);
INSERT INTO public.project_links (project_id, label, url, order_index) VALUES ('tupi', 'Repositório principal', '#', 0);
INSERT INTO public.project_links (project_id, label, url, order_index) VALUES ('tupi', 'Board do projeto', '#', 1);
INSERT INTO public.project_technologies (project_id, name, order_index) VALUES ('tupi', 'C', 0);
INSERT INTO public.project_technologies (project_id, name, order_index) VALUES ('tupi', 'Java', 1);
INSERT INTO public.project_technologies (project_id, name, order_index) VALUES ('tupi', 'Spring Boot', 2);
INSERT INTO public.project_technologies (project_id, name, order_index) VALUES ('tupi', 'RabbitMQ', 3);
INSERT INTO public.project_technologies (project_id, name, order_index) VALUES ('tupi', 'MySQL', 4);
INSERT INTO public.project_squads (project_id, name, order_index) VALUES ('tupi', 'Hardware', 0);
INSERT INTO public.project_squads (project_id, name, order_index) VALUES ('tupi', 'Recebíveis', 1);
INSERT INTO public.trilha_items (project_id, title, order_index) VALUES ('tupi', 'Conhecer o produto', 0);
INSERT INTO public.trilha_items (project_id, title, order_index) VALUES ('tupi', 'Instalar ambiente', 1);
INSERT INTO public.trilha_items (project_id, title, order_index) VALUES ('tupi', 'Configurar acessos', 2);
INSERT INTO public.trilha_items (project_id, title, order_index) VALUES ('tupi', 'Ler documentação', 3);
INSERT INTO public.trilha_items (project_id, title, order_index) VALUES ('tupi', 'Assistir vídeos', 4);
INSERT INTO public.trilha_items (project_id, title, order_index) VALUES ('tupi', 'Realizar treinamento', 5);
INSERT INTO public.trilha_items (project_id, title, order_index) VALUES ('tupi', 'Fazer exercício prático', 6);
INSERT INTO public.trilha_items (project_id, title, order_index) VALUES ('tupi', 'Validar conhecimentos', 7);
INSERT INTO public.doc_categories (project_id, name, icon, order_index) VALUES ('tupi', 'Arquitetura', 'Layers', 0);
INSERT INTO public.doc_categories (project_id, name, icon, order_index) VALUES ('tupi', 'Regras de negócio', 'ListTree', 1);
INSERT INTO public.doc_categories (project_id, name, icon, order_index) VALUES ('tupi', 'Fluxos', 'Workflow', 2);
INSERT INTO public.doc_categories (project_id, name, icon, order_index) VALUES ('tupi', 'Design System', 'Sparkles', 3);
INSERT INTO public.doc_categories (project_id, name, icon, order_index) VALUES ('tupi', 'APIs', 'Code2', 4);
INSERT INTO public.doc_categories (project_id, name, icon, order_index) VALUES ('tupi', 'Banco de Dados', 'Database', 5);
INSERT INTO public.doc_categories (project_id, name, icon, order_index) VALUES ('tupi', 'Padrões de Código', 'FileCode2', 6);
INSERT INTO public.doc_categories (project_id, name, icon, order_index) VALUES ('tupi', 'Boas práticas', 'ShieldCheck', 7);
INSERT INTO public.documents (project_id, category_id, title, type, url, author)
SELECT 'tupi', dc.id, 'Comunicação maquininha ↔ backend', 'Diagrama', '#', 'Bruno Salgado'
FROM public.doc_categories dc WHERE dc.project_id = 'tupi' AND dc.name = 'Arquitetura';
INSERT INTO public.documents (project_id, category_id, title, type, url, author)
SELECT 'tupi', dc.id, 'Taxas e planos de antecipação', 'Documento', '#', 'Heloísa Drumond'
FROM public.doc_categories dc WHERE dc.project_id = 'tupi' AND dc.name = 'Regras de negócio';
INSERT INTO public.documents (project_id, category_id, title, type, url, author)
SELECT 'tupi', dc.id, 'Fluxo de ativação de maquininha', 'Fluxo', '#', 'Bruno Salgado'
FROM public.doc_categories dc WHERE dc.project_id = 'tupi' AND dc.name = 'Fluxos';
INSERT INTO public.documents (project_id, category_id, title, type, url, author)
SELECT 'tupi', dc.id, 'API de recebíveis', 'Referência', '#', 'Tiago Murano'
FROM public.doc_categories dc WHERE dc.project_id = 'tupi' AND dc.name = 'APIs';
INSERT INTO public.documents (project_id, category_id, title, type, url, author)
SELECT 'tupi', dc.id, 'Modelo de transações POS', 'Documento', '#', 'Bruno Salgado'
FROM public.doc_categories dc WHERE dc.project_id = 'tupi' AND dc.name = 'Banco de Dados';
INSERT INTO public.documents (project_id, category_id, title, type, url, author)
SELECT 'tupi', dc.id, 'Guia de estilo Java', 'Guia', '#', 'Tiago Murano'
FROM public.doc_categories dc WHERE dc.project_id = 'tupi' AND dc.name = 'Padrões de Código';
INSERT INTO public.glossario (project_id, term, definition) VALUES ('tupi', 'EMV', 'Padrão técnico de segurança usado em cartões com chip.');
INSERT INTO public.glossario (project_id, term, definition) VALUES ('tupi', 'Settlement', 'Liquidação financeira final de uma transação entre as partes.');
INSERT INTO public.glossario (project_id, term, definition) VALUES ('tupi', 'Chargeback', 'Estorno de uma transação contestada pelo titular do cartão.');
INSERT INTO public.glossario (project_id, term, definition) VALUES ('tupi', 'Antecipação', 'Recebimento adiantado de valores de vendas parceladas, mediante taxa.');
INSERT INTO public.team_members (project_id, name, role, area, contact, specialty) VALUES ('tupi', 'Bruno Salgado', 'Tech Lead', 'Engenharia', 'bruno.salgado@empresa.com', 'Sistemas embarcados');
INSERT INTO public.team_members (project_id, name, role, area, contact, specialty) VALUES ('tupi', 'Heloísa Drumond', 'Product Manager', 'Produto', 'heloisa.drumond@empresa.com', 'Recebíveis');
INSERT INTO public.team_members (project_id, name, role, area, contact, specialty) VALUES ('tupi', 'Tiago Murano', 'Engenheiro de Software', 'Engenharia', 'tiago.murano@empresa.com', 'Backend de pagamentos');
INSERT INTO public.stakeholders (project_id, name, role, area, contact, influence, interest, expectativa) VALUES ('tupi', 'Juliana Freitas', 'Gerente Comercial', 'Comercial', 'juliana.freitas@empresa.com', 'Alto', 'Alto', 'Crescimento de base de lojistas ativos');
INSERT INTO public.stakeholders (project_id, name, role, area, contact, influence, interest, expectativa) VALUES ('tupi', 'Marcos Vaz', 'Head de Operações', 'Operações', 'marcos.vaz@empresa.com', 'Alto', 'Médio', 'Redução de chamados de suporte de ativação');
INSERT INTO public.stakeholders (project_id, name, role, area, contact, influence, interest, expectativa) VALUES ('tupi', 'Sandra Oliveira', 'Diretora Financeira', 'Financeiro', 'sandra.oliveira@empresa.com', 'Médio', 'Alto', 'Controle das taxas e margens de antecipação');
INSERT INTO public.reunioes (project_id, name, description, frequency, duration, time, participants, link) VALUES ('tupi', 'Daily', 'Alinhamento rápido do time sobre progresso e bloqueios.', 'Diária', '15 min', '09:30', ARRAY['Devs', 'QA', 'Tech Lead'], 'https://meet.google.com/abc-defg-hij');
INSERT INTO public.reunioes (project_id, name, description, frequency, duration, time, participants, link) VALUES ('tupi', 'Sprint Planning', 'Planejamento do sprint com foco em hardware e recebíveis.', 'A cada 2 semanas', '1h30', '10:00 (seg)', ARRAY['Devs', 'PO', 'Tech Lead'], 'https://meet.google.com/abc-defg-hij');
INSERT INTO public.reunioes (project_id, name, description, frequency, duration, time, participants, link) VALUES ('tupi', 'Sprint Review', 'Demonstração de funcionalidades entregues.', 'A cada 2 semanas', '1h', '15:00 (sex)', ARRAY['Devs', 'PO', 'Comercial'], 'https://meet.google.com/abc-defg-hij');
INSERT INTO public.reunioes (project_id, name, description, frequency, duration, time, participants, link) VALUES ('tupi', 'Retrospectiva', 'Avaliação do processo e definição de melhorias.', 'A cada 2 semanas', '45 min', '16:00 (sex)', ARRAY['Time completo'], 'https://meet.google.com/abc-defg-hij');
INSERT INTO public.reunioes (project_id, name, description, frequency, duration, time, participants, link) VALUES ('tupi', 'Sync Hardware', 'Alinhamento específico sobre firmware e comunicação POS.', 'Semanal', '30 min', '14:00 (ter)', ARRAY['Squad Hardware'], 'https://meet.google.com/abc-defg-hij');
INSERT INTO public.faq (project_id, category, question, answer, order_index) VALUES ('tupi', 'Hardware', 'Como solicito uma maquininha de teste?', 'Solicite via canal #hardware-tupi informando o squad e o motivo.', 0);
INSERT INTO public.operacao_alertas (project_id, nome, severidade, significado, acao) VALUES ('tupi', 'POS_OFFLINE', 'Alta', 'Maquininha sem comunicação por mais de 10 minutos. Possível falha de rede no lojista ou travamento do firmware.', 'Verificar status no portal de gestão de dispositivos e acionar suporte remoto.');
INSERT INTO public.operacao_alertas (project_id, nome, severidade, significado, acao) VALUES ('tupi', 'TRANSACTION_TIMEOUT', 'Alta', 'Transação sem resposta da adquirente em mais de 30s. Pode indicar instabilidade no gateway.', 'Checar status da adquirente e logs do serviço payment-gateway.');
INSERT INTO public.operacao_alertas (project_id, nome, severidade, significado, acao) VALUES ('tupi', 'ANTECIPACAO_FALHA', 'Média', 'Falha na liquidação de antecipação de recebíveis.', 'Acionar squad de Recebíveis via #squad-recebiveis e verificar API do banco parceiro.');
INSERT INTO public.operacao_diagnostico (project_id, step_text, order_index) VALUES ('tupi', '1. Verificar painel de status dos dispositivos POS no portal interno', 0);
INSERT INTO public.operacao_diagnostico (project_id, step_text, order_index) VALUES ('tupi', '2. Checar logs de transação no Kibana filtrando por terminal_id e status:failed', 1);
INSERT INTO public.operacao_diagnostico (project_id, step_text, order_index) VALUES ('tupi', '3. Confirmar se a falha é pontual (1 terminal) ou sistêmica (múltiplos terminais)', 2);
INSERT INTO public.operacao_diagnostico (project_id, step_text, order_index) VALUES ('tupi', '4. Verificar conectividade da adquirente nos dashboards de parceiros', 3);
INSERT INTO public.operacao_diagnostico (project_id, step_text, order_index) VALUES ('tupi', '5. Acionar o suporte remoto do hardware se o dispositivo não responder', 4);
INSERT INTO public.operacao_diagnostico (project_id, step_text, order_index) VALUES ('tupi', '6. Abrir ticket no sistema de suporte com evidências de logs para escalation', 5);
INSERT INTO public.operacao_contatos (project_id, problema, responsavel, canal, order_index) VALUES ('tupi', 'Falha de hardware / firmware', 'Bruno Salgado (Tech Lead)', '#hardware-tupi', 0);
INSERT INTO public.operacao_contatos (project_id, problema, responsavel, canal, order_index) VALUES ('tupi', 'Transação reprovada / gateway', 'Tiago Murano (Backend)', '#squad-pagamentos-tupi', 1);
INSERT INTO public.operacao_contatos (project_id, problema, responsavel, canal, order_index) VALUES ('tupi', 'Antecipação de recebíveis', 'Squad Recebíveis', '#squad-recebiveis', 2);
INSERT INTO public.operacao_contatos (project_id, problema, responsavel, canal, order_index) VALUES ('tupi', 'Atendimento ao lojista', 'Suporte Tupi', '#suporte-tupi', 3);
INSERT INTO public.operacao_logs (project_id, sistema, onde, filtro, order_index) VALUES ('tupi', 'Transações POS', 'Kibana → Index tupi-transactions', 'terminal_id:<id> AND status:failed | últimas 2h', 0);
INSERT INTO public.operacao_logs (project_id, sistema, onde, filtro, order_index) VALUES ('tupi', 'Firmware de dispositivos', 'Portal de gestão de dispositivos → Logs', 'Filtrar por device_id e nível WARN/ERROR', 1);
INSERT INTO public.operacao_logs (project_id, sistema, onde, filtro, order_index) VALUES ('tupi', 'API de recebíveis', 'Datadog → Services → recebiveis-api', 'status:error @operation:liquidacao', 2);
INSERT INTO public.operacao_canais (project_id, nome, plataforma, descricao, order_index) VALUES ('tupi', '#tupi-geral', 'Slack', 'Comunicações gerais do produto Tupi.', 0);
INSERT INTO public.operacao_canais (project_id, nome, plataforma, descricao, order_index) VALUES ('tupi', '#hardware-tupi', 'Slack', 'Discussões técnicas sobre dispositivos POS e firmware.', 1);
INSERT INTO public.operacao_canais (project_id, nome, plataforma, descricao, order_index) VALUES ('tupi', '#squad-recebiveis', 'Slack', 'Time responsável por antecipações e liquidações.', 2);
INSERT INTO public.operacao_canais (project_id, nome, plataforma, descricao, order_index) VALUES ('tupi', 'Board Jira Tupi', 'Jira', 'Backlog, sprints e épicos do produto Tupi.', 3);
COMMIT;