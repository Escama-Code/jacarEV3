"""
Módulo de Acessibilidade da jacarEV3
Fornece recursos de feedback sonoro, tátil e descrições textuais 
acessíveis para leitores de tela durante as execuções em sala de aula.
"""

class AcessibilidadeRobo:
    @staticmethod
    def anunciar_e_executar(descricao: str, funcao_execucao, robo_instancia=None):
        """
        Anuncia visualmente no console (compatível com leitores de tela) 
        e opcionalmente emite um sinal sonoro no EV3 antes de executar a ação.
        """
        print(f"\n[ACESSIBILIDADE] 👁️ Ação em andamento: {descricao}")
        
        # Se houver uma instância do robô conectada, emite um bipe curto de alerta
        if robo_instancia:
            try:
                robo_instancia.apitar(frequencia=523, duracao_ms=150)
            except Exception:
                pass
                
        # Executa a rotina principal passada por função
        resultado = funcao_execucao()
        print(f"[ACESSIBILIDADE] ✅ Concluído: {descricao}\n")
        return resultado