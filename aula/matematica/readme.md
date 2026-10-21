# Módulo de Aula: Matemática — Geometria e Ângulos na Prática

**Público-alvo:** Ensino Fundamental II (Anos Finais)  
**Objetivo Pedagógico:** Compreender propriedades de polígonos regulares, cálculo de perímetros e ângulos externos através do deslocamento programado de um robô.

---

### 📐 Conceito Matemático
A soma dos ângulos externos de qualquer polígono fechado é sempre **360°**. Para desenhar uma figura geométrica (como um quadrado ou um triângulo equilátero) utilizando um robô com rodas, o aluno precisa relacionar a distância percorrida (lados) com o ângulo de guinada (giro).

### 🚀 Atividade Prática: Desenhando um Quadrado Perfeito
Utilizando a biblioteca `jacarEV3`, os alunos programam o robô para avançar em linha reta e girar 90 graus repetidas vezes.

```python
from jacarev3.robo import RoboEV3

# Conectando ao robô EV3
with RoboEV3(mac='00:16:53:64:F8:B8') as robo:
    # O quadrado possui 4 lados iguais
    for lado in range(4):
        print(f"Desenhando o lado {lado + 1} do quadrado...")
        
        # Move a base motriz em linha reta por 1,5 segundos
        robo.mover_base(velocidade=30, duracao_ms=1500)
        
        # Gira o robô em 90 graus (ajustando o tempo/rotação do motor)
        robo.girar_motor('B', velocidade=30, duracao_ms=500, frear=True)
        
    robo.apitar(frequencia=880, duracao_ms=400) # Som de conclusão