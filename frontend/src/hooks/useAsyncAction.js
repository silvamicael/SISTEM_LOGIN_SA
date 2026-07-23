import { useCallback, useState } from "react";

export function useAsyncAction() {
    const [mensagem, setMensagem] = useState("");
    const [erro, setErro] = useState("");
    const [carregando, setCarregando] = useState(false);

    const executar = useCallback(async (acao) => {
        setMensagem("");
        setErro("");
        setCarregando(true);

        try {
            return await acao();
        } catch (error) {
            setErro(error.message);
            return undefined;
        } finally {
            setCarregando(false);
        }
    }, []);

    return { mensagem, erro, carregando, executar, setMensagem, setErro };
}
