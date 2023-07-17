import { Configuration, OpenAIApi } from "openai";

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

export default async function (req, res) {
  if (!configuration.apiKey) {
    res.status(500).json({
      error: {
        message: "OpenAI API key not configured, please follow instructions in README.md",
      }
    });
    return;
  }

  const animal = req.body.animal || '';
  if (animal.trim().length === 0) {
    res.status(400).json({
      error: {
        message: "Please enter a valid animal",
      }
    });
    return;
  }

  try {
    const completion = await openai.createCompletion({
      model: "text-davinci-003",
      prompt: generatePrompt(animal),
      temperature: 0.6,
      max_tokens: 100,
    });

    console.log(completion.data.choices[0].text)
    res.status(200).json({ result: completion.data.choices[0].text });
  } catch (error) {
    // Consider adjusting the error handling logic for your use case
    if (error.response) {
      console.error(error.response.status, error.response.data);
      res.status(error.response.status).json(error.response.data);
    } else {
      console.error(`Error with OpenAI API request: ${error.message}`);
      res.status(500).json({
        error: {
          message: 'An error occurred during your request.',
        }
      });
    }
  }
}

function generatePrompt(animal) {
  const capitalizedAnimal =
    animal[0].toUpperCase() + animal.slice(1).toLowerCase();
  return `Caso seja informado uma pergunta com uma pergunta diferente, responda não tenho essas informações.
           Sempre gerar uma resposta com 550 caracteres.
           Sempre no final do texto coloque o Atenciosamente 1 Registro de Imoveis de Goiania.
           Abaixo são as perguntas e respostas para responder os clientes do cartório.
            O casamento estabelece a comunhão plena de vida, com base na igualdade de direitos e deveres dos cônjuges. Pelos princípios da continuidade registral e da especialidade subjetiva, todas as alterações de estado civil deverão ser averbadas na matrícula.
            Previsão Legal – artigos 1.511 e ss. e 1.653 e ss. do Código Civil; artigos 167, 176, 217, 225, 244, 246 e ss. da Lei n. 6.015/1973.
            Documentos necessários:
            Requerimento do interessado, com firma reconhecida, indicando expressamente o imóvel e seu número de matrícula, bem como a qualificação do cônjuge (nome, nacionalidade, profissão, número do RG, CPF e domicílio), acompanhado da cópia autenticada do RG e CPF do mesmo;
            Certidão de casamento, na forma original ou em cópia autenticada;
            Se o regime de bens do casamento não for o da comunhão parcial, ou o obrigatoriamente estabelecido, apresentar certidão de registro do pacto antenupcial emitida pelo Registro de Imóveis em que foi registrado ou o próprio pacto antenupcial, em sua via original ou em cópia autenticada, desde que, neste caso, conste carimbo ou etiqueta do Registro de Imóveis declarando, resumidamente, os atos praticados*.
            O pacto antenupcial deve ser registrado no domicílio do casal. Caso o domicílio seja nesta Circunscrição, deverá apresentar via original do pacto antenupcial para registro no livro 03 desta Serventia.
            Pergunta Cliente: ${capitalizedAnimal}
            Reposta Cartorio:`;
}
