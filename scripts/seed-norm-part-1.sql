BEGIN;
-- ===== APP Banking =====
INSERT INTO public.projects (id, name, tagline, description, color, soft, icon, team_lead, team_size)
VALUES ('app-banking', 'APP Banking', 'Aplicativo bancário para pessoa física', 'Aplicativo mobile que concentra conta digital, cartão, Pix e investimentos para clientes pessoa física. É o produto carro-chefe da companhia, com mais de 2 milhões de usuários ativos.', '#0E7C66', '#E6F4F1', 'Smartphone', 'Marina Tassi', 14)
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, tagline = EXCLUDED.tagline, description = EXCLUDED.description, color = EXCLUDED.color, soft = EXCLUDED.soft, icon = EXCLUDED.icon, team_lead = EXCLUDED.team_lead, team_size = EXCLUDED.team_size, updated_at = now();

INSERT INTO public.project_objectives (project_id, description, order_index) VALUES ('app-banking', 'Reduzir o tempo de abertura de conta para menos de 3 minutos', 0);
INSERT INTO public.project_objectives (project_id, description, order_index) VALUES ('app-banking', 'Elevar a adoção do Pix recorrente em 20% no próximo trimestre', 1);
INSERT INTO public.project_objectives (project_id, description, order_index) VALUES ('app-banking', 'Manter disponibilidade acima de 99.9%', 2);
INSERT INTO public.project_metrics (project_id, label, target, order_index) VALUES ('app-banking', 'Tempo de abertura de conta', '< 3 min', 0);
INSERT INTO public.project_metrics (project_id, label, target, order_index) VALUES ('app-banking', 'Adoção de Pix recorrente', '+20% no trimestre', 1);
INSERT INTO public.project_metrics (project_id, label, target, order_index) VALUES ('app-banking', 'Disponibilidade do app', '≥ 99.9%', 2);
INSERT INTO public.project_metrics (project_id, label, target, order_index) VALUES ('app-banking', 'NPS do produto', '≥ 65 pontos', 3);
INSERT INTO public.project_links (project_id, label, url, order_index) VALUES ('app-banking', 'Repositório principal', '#', 0);
INSERT INTO public.project_links (project_id, label, url, order_index) VALUES ('app-banking', 'Board do projeto', '#', 1);
INSERT INTO public.project_links (project_id, label, url, order_index) VALUES ('app-banking', 'Design System', '#', 2);
INSERT INTO public.project_technologies (project_id, name, order_index) VALUES ('app-banking', 'React Native', 0);
INSERT INTO public.project_technologies (project_id, name, order_index) VALUES ('app-banking', 'Kotlin', 1);
INSERT INTO public.project_technologies (project_id, name, order_index) VALUES ('app-banking', 'Swift', 2);
INSERT INTO public.project_technologies (project_id, name, order_index) VALUES ('app-banking', 'Node.js', 3);
INSERT INTO public.project_technologies (project_id, name, order_index) VALUES ('app-banking', 'PostgreSQL', 4);
INSERT INTO public.project_technologies (project_id, name, order_index) VALUES ('app-banking', 'Kafka', 5);
INSERT INTO public.project_squads (project_id, name, order_index) VALUES ('app-banking', 'Conta & Cartão', 0);
INSERT INTO public.project_squads (project_id, name, order_index) VALUES ('app-banking', 'Pix', 1);
INSERT INTO public.project_squads (project_id, name, order_index) VALUES ('app-banking', 'Investimentos', 2);
INSERT INTO public.trilha_items (project_id, title, order_index) VALUES ('app-banking', 'Conhecer o produto', 0);
INSERT INTO public.trilha_items (project_id, title, order_index) VALUES ('app-banking', 'Instalar ambiente', 1);
INSERT INTO public.trilha_items (project_id, title, order_index) VALUES ('app-banking', 'Configurar acessos', 2);
INSERT INTO public.trilha_items (project_id, title, order_index) VALUES ('app-banking', 'Ler documentação', 3);
INSERT INTO public.trilha_items (project_id, title, order_index) VALUES ('app-banking', 'Assistir vídeos', 4);
INSERT INTO public.trilha_items (project_id, title, order_index) VALUES ('app-banking', 'Realizar treinamento', 5);
INSERT INTO public.trilha_items (project_id, title, order_index) VALUES ('app-banking', 'Fazer exercício prático', 6);
INSERT INTO public.trilha_items (project_id, title, order_index) VALUES ('app-banking', 'Validar conhecimentos', 7);
INSERT INTO public.doc_categories (project_id, name, icon, order_index) VALUES ('app-banking', 'Arquitetura', 'Layers', 0);
INSERT INTO public.doc_categories (project_id, name, icon, order_index) VALUES ('app-banking', 'Regras de negócio', 'ListTree', 1);
INSERT INTO public.doc_categories (project_id, name, icon, order_index) VALUES ('app-banking', 'Fluxos', 'Workflow', 2);
INSERT INTO public.doc_categories (project_id, name, icon, order_index) VALUES ('app-banking', 'Design System', 'Sparkles', 3);
INSERT INTO public.doc_categories (project_id, name, icon, order_index) VALUES ('app-banking', 'APIs', 'Code2', 4);
INSERT INTO public.doc_categories (project_id, name, icon, order_index) VALUES ('app-banking', 'Banco de Dados', 'Database', 5);
INSERT INTO public.doc_categories (project_id, name, icon, order_index) VALUES ('app-banking', 'Padrões de Código', 'FileCode2', 6);
INSERT INTO public.doc_categories (project_id, name, icon, order_index) VALUES ('app-banking', 'Boas práticas', 'ShieldCheck', 7);
INSERT INTO public.documents (project_id, category_id, title, type, url, author)
SELECT 'app-banking', dc.id, 'Visão geral de microsserviços', 'Diagrama', '#', 'Marina Tassi'
FROM public.doc_categories dc WHERE dc.project_id = 'app-banking' AND dc.name = 'Arquitetura';
INSERT INTO public.documents (project_id, category_id, title, type, url, author)
SELECT 'app-banking', dc.id, 'Diagrama de infraestrutura', 'Diagrama', '#', 'Rafael Quintão'
FROM public.doc_categories dc WHERE dc.project_id = 'app-banking' AND dc.name = 'Arquitetura';
INSERT INTO public.documents (project_id, category_id, title, type, url, author)
SELECT 'app-banking', dc.id, 'Política de limites do Pix', 'Documento', '#', 'Igor Bandeira'
FROM public.doc_categories dc WHERE dc.project_id = 'app-banking' AND dc.name = 'Regras de negócio';
INSERT INTO public.documents (project_id, category_id, title, type, url, author)
SELECT 'app-banking', dc.id, 'Regras de score de crédito', 'Documento', '#', 'Igor Bandeira'
FROM public.doc_categories dc WHERE dc.project_id = 'app-banking' AND dc.name = 'Regras de negócio';
INSERT INTO public.documents (project_id, category_id, title, type, url, author)
SELECT 'app-banking', dc.id, 'Fluxo de abertura de conta', 'Fluxo', '#', 'Cecília Worm'
FROM public.doc_categories dc WHERE dc.project_id = 'app-banking' AND dc.name = 'Fluxos';
INSERT INTO public.documents (project_id, category_id, title, type, url, author)
SELECT 'app-banking', dc.id, 'Fluxo de contestação', 'Fluxo', '#', 'Cecília Worm'
FROM public.doc_categories dc WHERE dc.project_id = 'app-banking' AND dc.name = 'Fluxos';
INSERT INTO public.documents (project_id, category_id, title, type, url, author)
SELECT 'app-banking', dc.id, 'Biblioteca de componentes mobile', 'Referência', '#', 'Cecília Worm'
FROM public.doc_categories dc WHERE dc.project_id = 'app-banking' AND dc.name = 'Design System';
INSERT INTO public.documents (project_id, category_id, title, type, url, author)
SELECT 'app-banking', dc.id, 'Catálogo de endpoints internos', 'Referência', '#', 'Rafael Quintão'
FROM public.doc_categories dc WHERE dc.project_id = 'app-banking' AND dc.name = 'APIs';
INSERT INTO public.documents (project_id, category_id, title, type, url, author)
SELECT 'app-banking', dc.id, 'Modelo de dados de contas', 'Documento', '#', 'Marina Tassi'
FROM public.doc_categories dc WHERE dc.project_id = 'app-banking' AND dc.name = 'Banco de Dados';
INSERT INTO public.documents (project_id, category_id, title, type, url, author)
SELECT 'app-banking', dc.id, 'Guia de estilo React Native', 'Guia', '#', 'Rafael Quintão'
FROM public.doc_categories dc WHERE dc.project_id = 'app-banking' AND dc.name = 'Padrões de Código';
INSERT INTO public.documents (project_id, category_id, title, type, url, author)
SELECT 'app-banking', dc.id, 'Checklist de code review', 'Guia', '#', 'Marina Tassi'
FROM public.doc_categories dc WHERE dc.project_id = 'app-banking' AND dc.name = 'Boas práticas';
INSERT INTO public.glossario (project_id, term, definition) VALUES ('app-banking', 'PIX', 'Sistema de pagamentos instantâneos do Banco Central do Brasil.');
INSERT INTO public.glossario (project_id, term, definition) VALUES ('app-banking', 'Settlement', 'Liquidação financeira final de uma transação entre as partes.');
INSERT INTO public.glossario (project_id, term, definition) VALUES ('app-banking', 'Chargeback', 'Estorno de uma transação contestada pelo titular do cartão.');
INSERT INTO public.glossario (project_id, term, definition) VALUES ('app-banking', 'Webhook', 'Notificação automática enviada por um sistema quando um evento ocorre.');
INSERT INTO public.glossario (project_id, term, definition) VALUES ('app-banking', 'Rollback', 'Reversão de uma alteração para um estado anterior estável.');
INSERT INTO public.glossario (project_id, term, definition) VALUES ('app-banking', 'EMV', 'Padrão técnico de segurança usado em cartões com chip.');
INSERT INTO public.team_members (project_id, name, role, area, contact, specialty) VALUES ('app-banking', 'Marina Tassi', 'Tech Lead', 'Engenharia', 'marina.tassi@empresa.com', 'Arquitetura mobile');
INSERT INTO public.team_members (project_id, name, role, area, contact, specialty) VALUES ('app-banking', 'Igor Bandeira', 'Product Manager', 'Produto', 'igor.bandeira@empresa.com', 'Estratégia de produto');
INSERT INTO public.team_members (project_id, name, role, area, contact, specialty) VALUES ('app-banking', 'Cecília Worm', 'Design Lead', 'Design', 'cecilia.worm@empresa.com', 'Design System');
INSERT INTO public.team_members (project_id, name, role, area, contact, specialty) VALUES ('app-banking', 'Rafael Quintão', 'Engenheiro de Software', 'Engenharia', 'rafael.quintao@empresa.com', 'Pix & Pagamentos');
INSERT INTO public.stakeholders (project_id, name, role, area, contact, influence, interest, expectativa) VALUES ('app-banking', 'Fernanda Lima', 'Head de Produto Digital', 'Produto', 'fernanda.lima@empresa.com', 'Alto', 'Alto', 'Entregas no prazo e qualidade de UX');
INSERT INTO public.stakeholders (project_id, name, role, area, contact, influence, interest, expectativa) VALUES ('app-banking', 'Carlos Menezes', 'Diretor de TI', 'Tecnologia', 'carlos.menezes@empresa.com', 'Alto', 'Médio', 'Estabilidade e segurança da plataforma');
INSERT INTO public.stakeholders (project_id, name, role, area, contact, influence, interest, expectativa) VALUES ('app-banking', 'Ana Beatriz', 'Head de Compliance', 'Jurídico', 'ana.beatriz@empresa.com', 'Médio', 'Alto', 'Aderência às regulações do Bacen');
INSERT INTO public.stakeholders (project_id, name, role, area, contact, influence, interest, expectativa) VALUES ('app-banking', 'Roberto Alencar', 'CFO', 'Financeiro', 'roberto.alencar@empresa.com', 'Alto', 'Baixo', 'ROI e controle de custos de infra');
INSERT INTO public.reunioes (project_id, name, description, frequency, duration, time, participants, link) VALUES ('app-banking', 'Daily', 'Alinhamento diário: o que foi feito, o que será feito, impedimentos.', 'Diária', '15 min', '09:15', ARRAY['Devs', 'QA', 'Tech Lead'], 'https://meet.google.com/abc-defg-hij');
INSERT INTO public.reunioes (project_id, name, description, frequency, duration, time, participants, link) VALUES ('app-banking', 'Sprint Planning', 'Planejamento das tarefas do próximo sprint com refinamento do backlog.', 'A cada 2 semanas', '2h', '09:00 (seg)', ARRAY['Devs', 'QA', 'PO', 'Tech Lead'], 'https://meet.google.com/abc-defg-hij');
INSERT INTO public.reunioes (project_id, name, description, frequency, duration, time, participants, link) VALUES ('app-banking', 'Sprint Review', 'Demonstração das funcionalidades entregues no sprint.', 'A cada 2 semanas', '1h', '16:00 (sex)', ARRAY['Devs', 'PO', 'Stakeholders'], 'https://meet.google.com/abc-defg-hij');
INSERT INTO public.reunioes (project_id, name, description, frequency, duration, time, participants, link) VALUES ('app-banking', 'Retrospectiva', 'Análise do processo: o que funcionou, o que melhorar, ações de melhoria.', 'A cada 2 semanas', '1h', '17:00 (sex)', ARRAY['Devs', 'QA', 'Tech Lead', 'PO'], 'https://meet.google.com/abc-defg-hij');
INSERT INTO public.reunioes (project_id, name, description, frequency, duration, time, participants, link) VALUES ('app-banking', 'Refinamento', 'Detalhamento e estimativa das histórias do backlog para futuros sprints.', 'Semanal', '1h', '14:00 (qua)', ARRAY['Devs', 'PO'], 'https://meet.google.com/abc-defg-hij');
INSERT INTO public.reunioes (project_id, name, description, frequency, duration, time, participants, link) VALUES ('app-banking', 'Sync com Stakeholders', 'Atualização de roadmap e alinhamento de expectativas com as lideranças.', 'Mensal', '1h', '10:00 (1ª seg)', ARRAY['PO', 'Tech Lead', 'Stakeholders'], 'https://meet.google.com/abc-defg-hij');
INSERT INTO public.faq (project_id, category, question, answer, order_index) VALUES ('app-banking', 'Acesso', 'Como solicito acesso ao repositório?', 'Abra um chamado no canal #acessos-app-banking com seu usuário do GitHub.', 0);
INSERT INTO public.faq (project_id, category, question, answer, order_index) VALUES ('app-banking', 'Acesso', 'Quem aprova permissões de produção?', 'O Tech Lead do squad responsável aprova via formulário interno.', 1);
INSERT INTO public.faq (project_id, category, question, answer, order_index) VALUES ('app-banking', 'Ambiente', 'Como configuro o ambiente local?', 'Siga o guia em Documentação > Padrões de Código, seção de setup.', 2);
INSERT INTO public.operacao_alertas (project_id, nome, severidade, significado, acao) VALUES ('app-banking', 'HIGH_LATENCY_PIX', 'Alta', 'Tempo de resposta do Pix acima de 3s. Pode indicar gargalo no serviço de pagamentos ou timeout com o Bacen.', 'Verificar logs do serviço pix-processor e métricas de fila Kafka.');
INSERT INTO public.operacao_alertas (project_id, nome, severidade, significado, acao) VALUES ('app-banking', 'DB_CONNECTION_POOL_EXHAUSTED', 'Alta', 'Pool de conexões com o PostgreSQL esgotado. Risco de indisponibilidade do app.', 'Aumentar pool temporariamente e investigar queries lentas com EXPLAIN ANALYZE.');
INSERT INTO public.operacao_alertas (project_id, nome, severidade, significado, acao) VALUES ('app-banking', 'FAILED_LOGIN_SPIKE', 'Média', 'Pico de tentativas de login com falha. Possível ataque de credential stuffing.', 'Ativar rate limiting e notificar time de segurança via #seguranca-banking.');
INSERT INTO public.operacao_alertas (project_id, nome, severidade, significado, acao) VALUES ('app-banking', 'CERT_EXPIRY_WARNING', 'Baixa', 'Certificado SSL/TLS com menos de 30 dias para expirar.', 'Renovar certificado via painel da AWS Certificate Manager.');
INSERT INTO public.operacao_diagnostico (project_id, step_text, order_index) VALUES ('app-banking', '1. Verificar o status de saúde no painel de observabilidade (Datadog)', 0);
INSERT INTO public.operacao_diagnostico (project_id, step_text, order_index) VALUES ('app-banking', '2. Checar os logs do serviço afetado filtrando por nível ERROR nos últimos 30 min', 1);
INSERT INTO public.operacao_diagnostico (project_id, step_text, order_index) VALUES ('app-banking', '3. Verificar se há deploy recente que possa ter introduzido a regressão', 2);
INSERT INTO public.operacao_diagnostico (project_id, step_text, order_index) VALUES ('app-banking', '4. Analisar métricas de CPU, memória e latência nos dashboards de infra', 3);
INSERT INTO public.operacao_diagnostico (project_id, step_text, order_index) VALUES ('app-banking', '5. Confirmar se o problema é isolado a um microsserviço ou afeta toda a plataforma', 4);
INSERT INTO public.operacao_diagnostico (project_id, step_text, order_index) VALUES ('app-banking', '6. Acionar o responsável técnico do squad afetado via canal #incidentes-banking', 5);
INSERT INTO public.operacao_diagnostico (project_id, step_text, order_index) VALUES ('app-banking', '7. Abrir post-mortem no Confluence após resolução para documentar aprendizados', 6);
INSERT INTO public.operacao_contatos (project_id, problema, responsavel, canal, order_index) VALUES ('app-banking', 'Indisponibilidade do app', 'Marina Tassi (Tech Lead)', '#incidentes-banking', 0);
INSERT INTO public.operacao_contatos (project_id, problema, responsavel, canal, order_index) VALUES ('app-banking', 'Falha no Pix ou pagamentos', 'Rafael Quintão (Squad Pix)', '#squad-pix', 1);
INSERT INTO public.operacao_contatos (project_id, problema, responsavel, canal, order_index) VALUES ('app-banking', 'Questões regulatórias / compliance', 'Ana Beatriz (Compliance)', '#compliance-banking', 2);
INSERT INTO public.operacao_contatos (project_id, problema, responsavel, canal, order_index) VALUES ('app-banking', 'Infraestrutura e cloud', 'SRE Team', '#sre-infra', 3);
INSERT INTO public.operacao_contatos (project_id, problema, responsavel, canal, order_index) VALUES ('app-banking', 'Design e UX', 'Cecília Worm (Design Lead)', '#design-banking', 4);
INSERT INTO public.operacao_logs (project_id, sistema, onde, filtro, order_index) VALUES ('app-banking', 'Aplicação mobile (React Native)', 'Datadog APM → Services → app-banking-rn', 'status:error @env:production | últimos 30min', 0);
INSERT INTO public.operacao_logs (project_id, sistema, onde, filtro, order_index) VALUES ('app-banking', 'API de pagamentos', 'Datadog Logs → Index production-api', 'service:pix-processor level:ERROR', 1);
INSERT INTO public.operacao_logs (project_id, sistema, onde, filtro, order_index) VALUES ('app-banking', 'Banco de dados PostgreSQL', 'RDS console → Logs & events → error/postgresql.log', 'Filtrar por FATAL, ERROR ou slow query acima de 1000ms', 2);
INSERT INTO public.operacao_logs (project_id, sistema, onde, filtro, order_index) VALUES ('app-banking', 'Kafka (filas de eventos)', 'Confluent Cloud → Topics → Monitoring', 'Consumer lag > 1000 no tópico pix-events', 3);
INSERT INTO public.operacao_canais (project_id, nome, plataforma, descricao, order_index) VALUES ('app-banking', '#app-banking-geral', 'Slack', 'Canal principal do time para comunicações gerais do projeto.', 0);
INSERT INTO public.operacao_canais (project_id, nome, plataforma, descricao, order_index) VALUES ('app-banking', '#incidentes-banking', 'Slack', 'Alertas de produção e coordenação de incidentes em tempo real.', 1);
INSERT INTO public.operacao_canais (project_id, nome, plataforma, descricao, order_index) VALUES ('app-banking', '#squad-pix', 'Slack', 'Comunicação focada no squad de Pix e pagamentos.', 2);
INSERT INTO public.operacao_canais (project_id, nome, plataforma, descricao, order_index) VALUES ('app-banking', '#releases-banking', 'Slack', 'Notificações automáticas de deploy e changelog.', 3);
INSERT INTO public.operacao_canais (project_id, nome, plataforma, descricao, order_index) VALUES ('app-banking', 'Board Jira', 'Jira', 'Gestão de tarefas, sprints e backlog do produto.', 4);
COMMIT;