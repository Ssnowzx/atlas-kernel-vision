import unittest
from atlasos_sim import Microkernel, ControlodeVoo, NavigacaoIA, DriverCamera, AppCientifico


class AtlasOSSimulatorTests(unittest.TestCase):
    def test_registrar_enviar_escalonar(self):
        kernel = Microkernel()
        cv = ControlodeVoo()
        ni = NavigacaoIA()
        dc = DriverCamera()
        ac = AppCientifico()

        kernel.registrar_processo(cv)
        kernel.registrar_processo(ni)
        kernel.registrar_processo(dc)
        kernel.registrar_processo(ac)

        # enviar mensagem para controle de voo
        self.assertTrue(kernel.enviar_mensagem("ControlodeVoo", "Teste"))
        # Verifica que ficou trabalhando
        self.assertEqual(cv.estado, "TRABALHANDO")

        # escalonar deve permitir que o processo processe a mensagem e volte a OCIOSO
        kernel.escalonar()
        self.assertEqual(cv.estado, "OCIOSO")

    def test_travar_reiniciar_auto_cura(self):
        kernel = Microkernel()
        dc = DriverCamera()
        kernel.registrar_processo(dc)

        # travar e verificar
        dc.travar()
        self.assertEqual(dc.estado, "TRAVADO")

        # kernel deve reiniciar ao chamar verificar_e_tratar_falhas
        kernel.verificar_e_tratar_falhas()
        self.assertEqual(dc.estado, "OCIOSO")

    def test_enviar_para_processo_inexistente(self):
        kernel = Microkernel()
        # sem processos registrados, envio deve retornar False
        self.assertFalse(kernel.enviar_mensagem("NaoExiste", "msg"))


if __name__ == '__main__':
    unittest.main()
