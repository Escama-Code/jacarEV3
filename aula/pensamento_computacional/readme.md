---

#### 3. `aulas/pensamento_computacional/README.md`
```markdown
# Módulo de Aula: Pensamento Computacional — Lógica Condicional e Sensores

**Público-alvo:** Ensino Fundamental II (Anos Finais)  
**Objetivo Pedagógico:** Desenvolver algoritmos com estruturas de decisão (`se / então` ou `if / else`) utilizando leituras de sensores físicos do robô.

---

### 🧠 Conceito Computacional
A lógica condicional permite que um programa tome decisões autônomas com base no ambiente. O robô deve reagir de forma diferente dependendo do que o sensor detecta.

### 🚀 Atividade Prática: Robô Autônomo Desviador de Obstáculos
O robô avança continuamente até que o sensor ultrassônico detecte um objeto próximo, disparando uma manobra evasiva automática.

```python
from jacarev3.robo import RoboEV3

with RoboEV3(mac='00:16:53:64:F8:B8') as robo:
    print("Robô em patrulha autônoma...")
    
    # Mantém o robô andando em linha reta
    robo.mover_continuo('B', velocidade=30)
    robo.mover_continuo('C', velocidade=30)
    
    # Aguarda mudança no sensor ultrassônico (porta 1)
    # Se detectar obstáculo menor que 20cm, desvia
    detectou_obstaculo = False
    
    while not detectou_obstaculo:
        # Lê o valor do sensor de distância
        distancia = robo.ler_sensor_ultrassonico(1)
        
        if distancia < 20:
            print("Obstáculo detectado! Desviando...")
            robo.parar_motor('B')
            robo.parar_motor('C')
            
            # Dá ré e gira para o lado
            robo.girar_motor('B', velocidade=-30, duracao_ms=1000)
            detectou_obstaculo = True
            
    robo.apitar(frequencia=500, duracao_ms=500)