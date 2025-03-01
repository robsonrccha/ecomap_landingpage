exports.handler = async (event, context) => {
    if (event.httpMethod !== "POST") {
      return {
        statusCode: 405,
        body: "Método não permitido",
      };
    }
  
    const { name, email } = JSON.parse(event.body);
  
    // Aqui você pode salvar os dados em um banco de dados ou enviar um e-mail
    console.log("Dados recebidos:", { name, email });
  
    return {
      statusCode: 200,
      body: JSON.stringify({ message: "Inscrição realizada com sucesso!" }),
    };
  };