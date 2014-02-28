# Mapa

#### Realçar tropas no mapa

> **Requerimento** 

> + `Requerimento` Ativado na página de configurações
> + "Mostrar tropas" tem que ser pesquisado através do alquimista e ativado nas configurações do mapa

**Como funciona**

+ Você pode definir predefinições para ataque, defesa, condes e espiões na página de configurações
	+ Cor
	+ Símbolo
	+ Quantidade e unidade usada
+ As predefinições determinam se a povoação é realçada (Se unidades suficientes do tipo selecionado estão disponíveis)
+ Os quatro grupos podem ser ativados e desativados individualmente

#### Realçar grupos no mapa

> **Requerimento** 

> + `Realçar grupos no mapa` Ativado na página de configurações

**Como funciona**

+ Você pode adicionar dois grupos na página de configurações
+ Os grupos são pensados para ser ataque e defesa
+ Se a povoação é parte de um dos grupos selecionados, ela será marcada de acordo
+ Isto é independente da quantidade de tropas disponíveis na povoação

<a name="show-attacks"></a>
#### Mostrar ataques no mapa

> **Requerimento** 

> + `Salvar ataques/Mostrar ataques no mapa` Ativado na página de configurações
> + Ataques atualmente em execução tem que ser salvos [Como salvar ataques?](/docs/attacks#save-attacks)

**Como funciona**

+ Povoações atualmente sob ataque na parte vísivel do mapa são realçados
+ Movendo o mouse sobre uma povoação realçada revela um pop-up
+ O pop-up contém informações sobre todos os ataques salvos, para a povoação específica
	+ Quantidade de ataques
	+ Próximo Impacto
	+ Atacante
	+ Povoação do atacante

+ Ataques que já chegaram são automaticamente removidos da lista de ataques salvos

#### Exportar alvos do mapa

> **Requerimento** 

> + `Exportar alvos do mapa` Ativado na página de configurações

**Como funciona**

+ KES adiciona um formulário no topo do mapa
+ No campo de texto, um nome de jogador pode ser digitado (Atentar para grafia correta!)
+ Você pode exportar apenas povoações abandonadas usando uma caixa de seleção
+ Você pode obter os resultados com BB-Code usando uma caixa de seleção
+ Clicando em "Exportar alvos" vai criar um pop-up contendo as povoações de acordo com a seleção

#### Definir grupos no mapa

> **Requerimento** 

> + `Definir grupos no mapa` Ativado na página de configurações

**Como funciona**

+ KES adiciona um menu suspenso, assim como um botão na parte superior do mapa
+ Você pode escolher um grupo para aplicar a todas povoações atualmente exibidas no mapa 
+ Ao clicar em "Definir grupo" irá aplicar o grupo selecionado para todas as povoações no mapa
