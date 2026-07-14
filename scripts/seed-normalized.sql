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

-- ===== Reg+ =====
INSERT INTO public.projects (id, name, tagline, description, color, soft, icon, team_lead, team_size)
VALUES ('reg-plus', 'Reg+', 'Plataforma de compliance e gestão regulatória', 'Sistema interno responsável por monitorar obrigações regulatórias, prevenção à lavagem de dinheiro e relatórios exigidos pelo Banco Central.', '#6E3AAE', '#F1EAFB', 'ShieldCheck', 'Otávio Reszka', 6)
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, tagline = EXCLUDED.tagline, description = EXCLUDED.description, color = EXCLUDED.color, soft = EXCLUDED.soft, icon = EXCLUDED.icon, team_lead = EXCLUDED.team_lead, team_size = EXCLUDED.team_size, updated_at = now();

INSERT INTO public.project_objectives (project_id, description, order_index) VALUES ('reg-plus', 'Garantir 100% de aderência aos prazos regulatórios', 0);
INSERT INTO public.project_objectives (project_id, description, order_index) VALUES ('reg-plus', 'Automatizar a geração de relatórios obrigatórios', 1);
INSERT INTO public.project_objectives (project_id, description, order_index) VALUES ('reg-plus', 'Reduzir o tempo de análise de alertas de PLD', 2);
INSERT INTO public.project_metrics (project_id, label, target, order_index) VALUES ('reg-plus', 'Aderência a prazos regulatórios', '100%', 0);
INSERT INTO public.project_metrics (project_id, label, target, order_index) VALUES ('reg-plus', 'Relatórios obrigatórios automatizados', '100% até Q4', 1);
INSERT INTO public.project_metrics (project_id, label, target, order_index) VALUES ('reg-plus', 'Tempo médio de análise de alerta', '< 24h', 2);
INSERT INTO public.project_links (project_id, label, url, order_index) VALUES ('reg-plus', 'Repositório principal', '#', 0);
INSERT INTO public.project_links (project_id, label, url, order_index) VALUES ('reg-plus', 'Base de conhecimento de Compliance', '#', 1);
INSERT INTO public.project_technologies (project_id, name, order_index) VALUES ('reg-plus', 'Python', 0);
INSERT INTO public.project_technologies (project_id, name, order_index) VALUES ('reg-plus', 'Django', 1);
INSERT INTO public.project_technologies (project_id, name, order_index) VALUES ('reg-plus', 'Airflow', 2);
INSERT INTO public.project_technologies (project_id, name, order_index) VALUES ('reg-plus', 'PostgreSQL', 3);
INSERT INTO public.project_technologies (project_id, name, order_index) VALUES ('reg-plus', 'Elasticsearch', 4);
INSERT INTO public.project_squads (project_id, name, order_index) VALUES ('reg-plus', 'PLD', 0);
INSERT INTO public.project_squads (project_id, name, order_index) VALUES ('reg-plus', 'Relatórios Regulatórios', 1);
INSERT INTO public.trilha_items (project_id, title, order_index) VALUES ('reg-plus', 'Conhecer o produto', 0);
INSERT INTO public.trilha_items (project_id, title, order_index) VALUES ('reg-plus', 'Instalar ambiente', 1);
INSERT INTO public.trilha_items (project_id, title, order_index) VALUES ('reg-plus', 'Configurar acessos', 2);
INSERT INTO public.trilha_items (project_id, title, order_index) VALUES ('reg-plus', 'Ler documentação', 3);
INSERT INTO public.trilha_items (project_id, title, order_index) VALUES ('reg-plus', 'Assistir vídeos', 4);
INSERT INTO public.trilha_items (project_id, title, order_index) VALUES ('reg-plus', 'Realizar treinamento', 5);
INSERT INTO public.trilha_items (project_id, title, order_index) VALUES ('reg-plus', 'Fazer exercício prático', 6);
INSERT INTO public.trilha_items (project_id, title, order_index) VALUES ('reg-plus', 'Validar conhecimentos', 7);
INSERT INTO public.doc_categories (project_id, name, icon, order_index) VALUES ('reg-plus', 'Arquitetura', 'Layers', 0);
INSERT INTO public.doc_categories (project_id, name, icon, order_index) VALUES ('reg-plus', 'Regras de negócio', 'ListTree', 1);
INSERT INTO public.doc_categories (project_id, name, icon, order_index) VALUES ('reg-plus', 'Fluxos', 'Workflow', 2);
INSERT INTO public.doc_categories (project_id, name, icon, order_index) VALUES ('reg-plus', 'Design System', 'Sparkles', 3);
INSERT INTO public.doc_categories (project_id, name, icon, order_index) VALUES ('reg-plus', 'APIs', 'Code2', 4);
INSERT INTO public.doc_categories (project_id, name, icon, order_index) VALUES ('reg-plus', 'Banco de Dados', 'Database', 5);
INSERT INTO public.doc_categories (project_id, name, icon, order_index) VALUES ('reg-plus', 'Padrões de Código', 'FileCode2', 6);
INSERT INTO public.doc_categories (project_id, name, icon, order_index) VALUES ('reg-plus', 'Boas práticas', 'ShieldCheck', 7);
INSERT INTO public.documents (project_id, category_id, title, type, url, author)
SELECT 'reg-plus', dc.id, 'Pipeline de dados regulatórios', 'Diagrama', '#', 'Otávio Reszka'
FROM public.doc_categories dc WHERE dc.project_id = 'reg-plus' AND dc.name = 'Arquitetura';
INSERT INTO public.documents (project_id, category_id, title, type, url, author)
SELECT 'reg-plus', dc.id, 'Critérios de alerta de PLD', 'Documento', '#', 'Lívia Castanho'
FROM public.doc_categories dc WHERE dc.project_id = 'reg-plus' AND dc.name = 'Regras de negócio';
INSERT INTO public.documents (project_id, category_id, title, type, url, author)
SELECT 'reg-plus', dc.id, 'Fluxo de análise de alerta', 'Fluxo', '#', 'Otávio Reszka'
FROM public.doc_categories dc WHERE dc.project_id = 'reg-plus' AND dc.name = 'Fluxos';
INSERT INTO public.documents (project_id, category_id, title, type, url, author)
SELECT 'reg-plus', dc.id, 'Modelo de eventos regulatórios', 'Documento', '#', 'Otávio Reszka'
FROM public.doc_categories dc WHERE dc.project_id = 'reg-plus' AND dc.name = 'Banco de Dados';
INSERT INTO public.documents (project_id, category_id, title, type, url, author)
SELECT 'reg-plus', dc.id, 'Guia de estilo Python', 'Guia', '#', 'Otávio Reszka'
FROM public.doc_categories dc WHERE dc.project_id = 'reg-plus' AND dc.name = 'Padrões de Código';
INSERT INTO public.documents (project_id, category_id, title, type, url, author)
SELECT 'reg-plus', dc.id, 'Política de retenção de dados', 'Guia', '#', 'Lívia Castanho'
FROM public.doc_categories dc WHERE dc.project_id = 'reg-plus' AND dc.name = 'Boas práticas';
INSERT INTO public.glossario (project_id, term, definition) VALUES ('reg-plus', 'PLD', 'Prevenção à Lavagem de Dinheiro.');
INSERT INTO public.glossario (project_id, term, definition) VALUES ('reg-plus', 'Rollback', 'Reversão de uma alteração para um estado anterior estável.');
INSERT INTO public.glossario (project_id, term, definition) VALUES ('reg-plus', 'API', 'Interface que permite a comunicação entre sistemas diferentes.');
INSERT INTO public.team_members (project_id, name, role, area, contact, specialty) VALUES ('reg-plus', 'Otávio Reszka', 'Tech Lead', 'Engenharia', 'otavio.reszka@empresa.com', 'Pipelines de dados');
INSERT INTO public.team_members (project_id, name, role, area, contact, specialty) VALUES ('reg-plus', 'Lívia Castanho', 'Especialista em Compliance', 'Compliance', 'livia.castanho@empresa.com', 'Regulação do Banco Central');
INSERT INTO public.stakeholders (project_id, name, role, area, contact, influence, interest, expectativa) VALUES ('reg-plus', 'Gustavo Arruda', 'Diretor de Compliance', 'Compliance', 'gustavo.arruda@empresa.com', 'Alto', 'Alto', '100% de aderência aos prazos do Bacen sem falhas');
INSERT INTO public.stakeholders (project_id, name, role, area, contact, influence, interest, expectativa) VALUES ('reg-plus', 'Isabela Campos', 'Auditora Interna', 'Auditoria', 'isabela.campos@empresa.com', 'Alto', 'Alto', 'Rastreabilidade completa de todas as análises de PLD');
INSERT INTO public.stakeholders (project_id, name, role, area, contact, influence, interest, expectativa) VALUES ('reg-plus', 'Felipe Duarte', 'Head de Tecnologia', 'TI', 'felipe.duarte@empresa.com', 'Médio', 'Médio', 'Automação máxima de relatórios regulatórios');
INSERT INTO public.reunioes (project_id, name, description, frequency, duration, time, participants, link) VALUES ('reg-plus', 'Daily', 'Alinhamento de tarefas e prazos regulatórios do dia.', 'Diária', '15 min', '09:00', ARRAY['Devs', 'Compliance', 'Tech Lead'], 'https://meet.google.com/abc-defg-hij');
INSERT INTO public.reunioes (project_id, name, description, frequency, duration, time, participants, link) VALUES ('reg-plus', 'Sprint Planning', 'Planejamento com foco em obrigações regulatórias e PLD.', 'A cada 2 semanas', '1h30', '10:00 (seg)', ARRAY['Devs', 'PO', 'Compliance'], 'https://meet.google.com/abc-defg-hij');
INSERT INTO public.reunioes (project_id, name, description, frequency, duration, time, participants, link) VALUES ('reg-plus', 'Sprint Review', 'Validação das entregas com o time de Compliance.', 'A cada 2 semanas', '1h', '15:00 (sex)', ARRAY['Devs', 'Compliance', 'Auditoria'], 'https://meet.google.com/abc-defg-hij');
INSERT INTO public.reunioes (project_id, name, description, frequency, duration, time, participants, link) VALUES ('reg-plus', 'Reunião Regulatória Mensal', 'Revisão do calendário de obrigações e status de entregas ao Bacen.', 'Mensal', '2h', '10:00 (última qua)', ARRAY['Compliance', 'TI', 'Auditoria'], 'https://meet.google.com/abc-defg-hij');
INSERT INTO public.reunioes (project_id, name, description, frequency, duration, time, participants, link) VALUES ('reg-plus', 'Comitê de PLD', 'Análise de alertas críticos de PLD e decisões de encaminhamento.', 'Mensal', '1h', '14:00 (1ª ter)', ARRAY['Compliance', 'Tech Lead', 'Diretoria'], 'https://meet.google.com/abc-defg-hij');
INSERT INTO public.faq (project_id, category, question, answer, order_index) VALUES ('reg-plus', 'Regulação', 'Onde encontro o calendário regulatório?', 'Disponível na Documentação > Regras de negócio.', 0);
INSERT INTO public.operacao_alertas (project_id, nome, severidade, significado, acao) VALUES ('reg-plus', 'PLD_ALERT_CRITICAL', 'Alta', 'Alerta de PLD classificado como crítico pelo motor de regras. Requer análise manual imediata em até 24h.', 'Abrir caso no sistema de análise de PLD e acionar analista de Compliance via #pld-alertas.');
INSERT INTO public.operacao_alertas (project_id, nome, severidade, significado, acao) VALUES ('reg-plus', 'BACEN_REPORT_OVERDUE', 'Alta', 'Relatório obrigatório para o Bacen com prazo vencido ou em risco (menos de 1h para o deadline).', 'Acionar Otávio Reszka (Tech Lead) e Gustavo Arruda (Compliance) imediatamente.');
INSERT INTO public.operacao_alertas (project_id, nome, severidade, significado, acao) VALUES ('reg-plus', 'PIPELINE_DELAY', 'Média', 'Pipeline de ingestão de dados regulatórios com atraso superior a 30 minutos.', 'Verificar DAGs no Airflow e logs do Elasticsearch.');
INSERT INTO public.operacao_alertas (project_id, nome, severidade, significado, acao) VALUES ('reg-plus', 'DATA_QUALITY_FAIL', 'Média', 'Falha na validação de qualidade de dados que alimentam relatórios regulatórios.', 'Checar regras de validação no serviço data-quality-reg e reprocessar se necessário.');
INSERT INTO public.operacao_diagnostico (project_id, step_text, order_index) VALUES ('reg-plus', '1. Verificar o painel de status de obrigações regulatórias no Reg+', 0);
INSERT INTO public.operacao_diagnostico (project_id, step_text, order_index) VALUES ('reg-plus', '2. Checar logs do pipeline no Airflow (DAG: bacen_report_pipeline)', 1);
INSERT INTO public.operacao_diagnostico (project_id, step_text, order_index) VALUES ('reg-plus', '3. Verificar se os dados do Elasticsearch estão indexados corretamente', 2);
INSERT INTO public.operacao_diagnostico (project_id, step_text, order_index) VALUES ('reg-plus', '4. Confirmar se há jobs de reprocessamento pendentes na fila', 3);
INSERT INTO public.operacao_diagnostico (project_id, step_text, order_index) VALUES ('reg-plus', '5. Acionar Lívia Castanho (Compliance) para validação do impacto regulatório', 4);
INSERT INTO public.operacao_diagnostico (project_id, step_text, order_index) VALUES ('reg-plus', '6. Documentar o incidente no sistema de gestão de riscos', 5);
INSERT INTO public.operacao_diagnostico (project_id, step_text, order_index) VALUES ('reg-plus', '7. Notificar Diretor de Compliance se prazo regulatório estiver em risco', 6);
INSERT INTO public.operacao_contatos (project_id, problema, responsavel, canal, order_index) VALUES ('reg-plus', 'Alerta crítico de PLD', 'Lívia Castanho (Compliance)', '#pld-alertas', 0);
INSERT INTO public.operacao_contatos (project_id, problema, responsavel, canal, order_index) VALUES ('reg-plus', 'Relatório atrasado para o Bacen', 'Gustavo Arruda + Otávio Reszka', '#reg-urgente', 1);
INSERT INTO public.operacao_contatos (project_id, problema, responsavel, canal, order_index) VALUES ('reg-plus', 'Falha no pipeline de dados', 'Otávio Reszka (Tech Lead)', '#reg-plus-dev', 2);
INSERT INTO public.operacao_contatos (project_id, problema, responsavel, canal, order_index) VALUES ('reg-plus', 'Questão de auditoria', 'Isabela Campos (Auditora)', '#auditoria-interna', 3);
INSERT INTO public.operacao_logs (project_id, sistema, onde, filtro, order_index) VALUES ('reg-plus', 'Pipeline regulatório (Airflow)', 'Airflow UI → DAGs → bacen_report_pipeline', 'Tasks com status failed nas últimas 24h', 0);
INSERT INTO public.operacao_logs (project_id, sistema, onde, filtro, order_index) VALUES ('reg-plus', 'Elasticsearch (eventos reg.)', 'Kibana → Index reg-events-*', 'level:ERROR AND tag:regulatorio | últimas 2h', 1);
INSERT INTO public.operacao_logs (project_id, sistema, onde, filtro, order_index) VALUES ('reg-plus', 'Motor de regras PLD', 'Datadog → Services → pld-engine', 'alert_level:CRITICAL @operation:evaluate', 2);
INSERT INTO public.operacao_logs (project_id, sistema, onde, filtro, order_index) VALUES ('reg-plus', 'Serviço de geração de relatórios', 'Datadog Logs → Index production', 'service:bacen-report-generator status:error', 3);
INSERT INTO public.operacao_canais (project_id, nome, plataforma, descricao, order_index) VALUES ('reg-plus', '#reg-plus-geral', 'Slack', 'Canal principal do time Reg+ para comunicações do projeto.', 0);
INSERT INTO public.operacao_canais (project_id, nome, plataforma, descricao, order_index) VALUES ('reg-plus', '#pld-alertas', 'Slack', 'Notificações automáticas de alertas de PLD e escalations.', 1);
INSERT INTO public.operacao_canais (project_id, nome, plataforma, descricao, order_index) VALUES ('reg-plus', '#reg-urgente', 'Slack', 'Canal de emergência para incidentes com prazo regulatório em risco.', 2);
INSERT INTO public.operacao_canais (project_id, nome, plataforma, descricao, order_index) VALUES ('reg-plus', '#auditoria-interna', 'Slack', 'Comunicação com o time de auditoria interna.', 3);
INSERT INTO public.operacao_canais (project_id, nome, plataforma, descricao, order_index) VALUES ('reg-plus', 'Board Jira Reg+', 'Jira', 'Gestão de tarefas, épicos regulatórios e sprints.', 4);

COMMIT;
