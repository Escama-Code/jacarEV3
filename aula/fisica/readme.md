---

#### 2. `aulas/fisica/README.md`
```markdown
# Módulo de Aula: Física — Cinemática e Velocidade Média

**Público-alvo:** Ensino Fundamental II (Anos Finais)  
**Objetivo Pedagógico:** Investigar experimentalmente a relação entre espaço percorrido, tempo de deslocamento e velocidade média ($V_m = \Delta S / \Delta T$).

---

### ⚡ Conceito Físico
Na cinemática, a velocidade média indica o quanto um corpo se desloca em um determinado intervalo de tempo. Com a robótica educacional, os alunos deixam de apenas calcular no papel e passam a medir empiricamente.

### 🚀 Atividade Prática: Cronometrando o Percurso
Os alunos utilizam o cronômetro integrado do Python junto com a `jacarEV3` para registrar o tempo exato que o robô leva para percorrer uma pista de 1 metro sob diferentes potências de motor.

```python
import time
from jacarev3.robo import RoboEV3

with RoboEV3(mac='00:16:53:64:F8:B8') as robo:
    distancia_metros = 1.0  # Pista de 1 metro
    
    print("Iniciando teste de velocidade média...")
    inicio = time.time()
    
    # Executa o robô em velocidade constante
    robo.mover_base(velocidade=40, duracao_ms=2000)
    
    fim = time.time()
    tempo_gasto = fim - inicio
    
    velocidade_media = distancia_metros / tempo_gasto
    print(f"Tempo gasto: {tempo_gasto:.2f} segundos")
    print(f"Velocidade média estimada: {velocidade_media:.2f} m/s")
    
    robo.apitar(frequencia=600, duracao_ms=300)