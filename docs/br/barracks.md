# Quartel

## Ordens

#### Campos de coordenadas

+ KES remove valor zero nos campos de coordenadas

#### Inserir tropas rapidamente

> **Requerimento**

> + `Links de tropas no quartel` Ativado na página de configurações

**Como funciona**

+ "Selecionar todos" Insere todas as tropas disponíveis nos campos do formulário
+ Links de tropas #1, #2, #3 Insere valores de tropas de acordo com as definições

#### Alvo padrão da catapulta

+ KES Seleciona o alvo padrão da catapulta especificado nas configurações para cada ataque que usar catapultas

## Libertação em massa

> **Requerimento**

> + `Personalizar libertação em massa` Ativado na página de configurações

**Como funciona**

Em circunstâncias normais libertação em massa liberta a quantidade de tropas especificadas nos campos.
Quando `personalizar libertação em massa` é ativado KES libertará apenas tropas em excesso.

**Exemplo**

Tropas disponíveis: 12000 Guerreiro
Entrada: 10000 Guerreiro

Resultado com personalizar libertação em massa ativado 10000 Guerreiro
Resultado com personalizar libertação em massa desativado 2000 Guerreiro

## Simulador

> **Requerimento**
> + `Personalizar simulador` Ativado na página de configurações

**Como funciona**

+ Quantidades de tropas são exibidos como números inteiros novamente (5k é exibido como 5.000)
+ Recursos são exibidos como números inteiros novamente
+ Para alternar entre as duas visualizações, clique no botão no lado esquerdo
