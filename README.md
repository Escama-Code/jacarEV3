<p align="center">
  <img src="https://raw.githubusercontent.com/i-barbosa/jacarEV3/main/assets/logo.png" width="140" alt="Logo jacarEV3">
</p>

<h1 align="center">jacarEV3 🐊</h1>

<p align="center">
  Biblioteca <strong>Python em português</strong> para controlar o LEGO EV3 via Bluetooth.<br>
  Sem dependências externas — só a biblioteca padrão do Python.
</p>

<p align="center">
  <a href="https://pypi.org/project/jacarev3/"><img src="https://img.shields.io/pypi/v/jacarev3" alt="PyPI"></a>
  <a href="https://github.com/i-barbosa/jacarEV3/blob/main/LICENSE"><img src="https://img.shields.io/badge/License-MIT-yellow.svg" alt="MIT"></a>
  <img src="https://img.shields.io/badge/Python-3.8%2B-blue" alt="Python 3.8+">
  <img src="https://img.shields.io/badge/LEGO-EV3-green" alt="LEGO EV3">
</p>

---

## Por que jacarEV3?

- **Sintaxe em português** — `robo.led('VERDE')`, `robo.mover_continuo('B', 40)`
- **Zero dependências** — instala e funciona com o Python da escola
- **Pensada para aula** — testes de motor/sensor, seguir linha, desvio, teleop
- **Sem robô físico** — dá para usar `ConexaoFalsa` em laboratório
- **Acessibilidade** — anúncios e feedback para leitores de tela

Ideal para ensino de programação, robótica e pensamento computacional no ensino fundamental e médio.

---

## Instalação

```bash
pip install jacarev3
```

---

## Uso rápido

```python
from jacarev3 import RoboEV3

with RoboEV3('00:16:53:64:F8:B8') as robo:  # MAC do seu EV3
    robo.apitar()
    robo.led('VERDE')
    robo.testar_tudo()  # motores A–D e sensores 1–4
```

Troque o endereço pelo MAC Bluetooth do seu brick.

---

## O que a lib oferece

| Área | Exemplos |
|------|----------|
| **Conexão** | `RoboEV3`, `definir_base`, `fechar` |
| **Motores** | `girar_motor`, `mover_continuo`, `parar_motor`, graus/voltas, encoder |
| **Base motriz** | `mover_base`, `mover_base_graus`, `parar_base` |
| **Sensores** | `ler_sensor`, modos em `jacarev3.protocolo` |
| **Som e LED** | `apitar`, `led` |
| **Diagnóstico** | `testar_motor(es)`, `testar_sensores`, `testar_tudo` |
| **Tópicos prontos** | seguir linha, desviar obstáculo, controle remoto |
| **Sem hardware** | `jacarev3.falso.ConexaoFalsa` |
| **Inclusão** | `executar_com_acessibilidade`, `AcessibilidadeRobo` |

---

## Documentação e IDE

| Recurso | Link |
|---------|------|
| **Documentação / site** | [i-barbosa.github.io/jacarEV3](https://i-barbosa.github.io/jacarEV3/) |
| **IDE no navegador** (sandbox, campanha, simulação) | [escama-code.github.io/jacarEV3-IDE](https://escama-code.github.io/jacarEV3-IDE/public/) |
| **PyPI** | [pypi.org/project/jacarev3](https://pypi.org/project/jacarev3/) |

---

## Estrutura do pacote

```text
jacarev3/           → RoboEV3 (API principal)
jacarev3.topicos/   → seguir linha, desvio, controle remoto
jacarev3.falso/     → ConexaoFalsa (aula sem robô)
jacarev3.fontes/    → teclado, gamepad, UDP
jacarev3.protocolo/ → constantes de baixo nível
jacarev3.erros/     → exceções da biblioteca
```

---

## Contribuindo

Issues e pull requests são bem-vindos:

**[github.com/escama-code/jacarEV3](https://github.com/escama-code/jacarEV3)**

Veja também [CONTRIBUTING.md](CONTRIBUTING.md) e o [CHANGELOG.md](CHANGELOG.md).

---

## Colaboradores

<p align="center">
  <a href="https://github.com/i-barbosa/jacarEV3/graphs/contributors">
    <img src="https://contrib.rocks/image?repo=i-barbosa/jacarEV3" alt="Contributors do jacarEV3" />
  </a>
</p>

<p align="center">
  <a href="https://github.com/i-barbosa/jacarEV3/graphs/contributors">Ver commits e contribuições no GitHub</a>
  ·
  <a href="CHANGELOG.md">CHANGELOG</a>
</p>

### Quem fez o quê (resumo)

| Pessoa | Papel / contribuições principais |
|--------|-----------------------------------|
| **[Ítalo Vinicius](https://github.com/i-barbosa)** | Mantenedor — protocolo, `RoboEV3`, erros, documentação |
| **[Miguel Arcanjo](https://github.com/MiguelAR098)** | Encoder, motor por graus, base motriz, controle remoto |
| **[Adrews](https://github.com/Adrews1)** | Parâmetro `portas=` (apelidos e filtros em `testar_*`) |

A imagem de avatares acima **atualiza sozinha** conforme novos contributors entram no repositório. Os papéis da tabela são um resumo editorial (não substituem o histórico do Git).

---

## Organização

Projeto ligado ao ecossistema **[Escama Code](https://github.com/Escama-Code)** e ao Programa Embarque Digital.

---

## Licença

[MIT](LICENSE) — uso livre em escolas, projetos e pesquisa.
