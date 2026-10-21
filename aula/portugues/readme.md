---

#### 4. `aulas/portugues/README.md`
```markdown
# Módulo de Aula: Língua Portuguesa — Semântica e Instruções Algorítmicas

**Público-alvo:** Ensino Fundamental II (Anos Finais)  
**Objetivo Pedagógico:** Explorar a estruturação de textos instrucionais (receitas, manuais e algoritmos) compreendendo como a clareza semântica e a precisão dos comandos em língua portuguesa afetam a execução de uma tarefa.

---

### 📖 Conceito Linguístico
Um algoritmo nada mais é do que um texto instrucional altamente rigoroso. A grande barreira no aprendizado tradicional de programação é a mistura de códigos lógicos com o vocabulário em inglês técnico (`run_timed`, `brake`, `port`). A `jacarEV3` elimina esse ruído comunicacional.

### 🚀 Atividade Prática: Escrevendo um Roteiro Instrucional Legível
Os alunos criam "receitas de comportamento" para o robô usando comandos puramente semânticos em português, testando a coerência e a coesão das instruções dadas à máquina.

```python
from jacarev3.robo import RoboEV3

with RoboEV3(mac='00:16:53:64:F8:B8') as robo:
    # Sequência clara de instruções em língua portuguesa natural
    print("Iniciando rotina de saudações e alertas...")
    
    # 1. Emitir aviso sonoro inicial
    robo.apitar(frequencia=523, duracao_ms=300)
    
    # 2. Acender o painel de LED na cor verde indicando sistema operacional pronto
    robo.led('VERDE')
    
    # 3. Executar comando de movimento linear
    robo.girar_motor('B', velocidade=25, duracao_ms=1000)
    
    # 4. Finalizar sinalizando luz ambar intermitente
    robo.led('AMBAR_PISCA')
    print("Rotina executada conforme o roteiro instrucional.")