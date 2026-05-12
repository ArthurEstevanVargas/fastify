INSERT INTO categories (name, slug, description, display_order)
VALUES
  ('Saúde Menstrual', 'saude-menstrual', 'Conteúdos sobre ciclo menstrual, sintomas e cuidado cotidiano.', 1),
  ('Saúde Sexual', 'saude-sexual', 'Conteúdos educativos sobre sexualidade, prevenção e cuidado.', 2),
  ('Gravidez', 'gravidez', 'Conteúdos sobre gestação, acompanhamento e sinais importantes.', 3),
  ('Pós-parto', 'pos-parto', 'Conteúdos sobre recuperação, amamentação e saúde após o parto.', 4),
  ('Prevenção', 'prevencao', 'Conteúdos sobre exames, vacinação e prevenção em saúde.', 5),
  ('Menopausa', 'menopausa', 'Conteúdos sobre climatério, menopausa e qualidade de vida.', 6)
ON CONFLICT DO NOTHING;
