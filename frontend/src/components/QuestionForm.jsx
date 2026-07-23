function QuestionForm({ perguntas, respostas, onResponder, namePrefix }) {
    return (
        <div className="questions-list">
            {perguntas.map((pergunta) => (
                <div className="question-card" key={pergunta.id}>
                    <p className="question-title">{pergunta.enunciado}</p>

                    <div className="alternativas">
                        {pergunta.alternativas.map((alternativa) => (
                            <label key={alternativa} className="alternativa-item">
                                <input
                                    type="radio"
                                    name={`${namePrefix}-${pergunta.id}`}
                                    value={alternativa}
                                    checked={respostas[pergunta.id] === alternativa}
                                    onChange={() => onResponder(pergunta.id, alternativa)}
                                />
                                <span>{alternativa}</span>
                            </label>
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );
}

export default QuestionForm;
