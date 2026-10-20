package com.instadog.config;

import java.time.LocalDate;
import java.util.List;

/**
 * Dados fictícios usados para demonstração e captura de telas do portfólio.
 * Todo o conteúdo é inventado (tutores, cães, publicações e comentários).
 */
public final class DemoData {

    private DemoData() {
    }

    /** Tutor com perfil completo. */
    public record Tutor(String nome, String email, String senha, String cidade, String bio, int avatar) {
    }

    /** Cão com perfil completo. */
    public record Cao(String tutor, String nome, String raca, LocalDate nascimento, String porte, String bio, String foto) {
    }

    /** Publicação de um cão. */
    public record Post(String cao, String descricao, String imagem) {
    }

    /** Comentário em uma publicação (referenciado pelo índice da publicação). */
    public record Comentario(int post, String autor, String texto) {
    }

    /** Vínculo de seguir: {seguidor, seguido}. */
    public record Seguimento(String seguidor, String seguido) {
    }

    /** Recado (scrap) deixado no muro de um perfil. */
    public record Scrap(String destinatario, String autor, String texto) {
    }

    public static final List<Tutor> TUTORES = List.of(
            new Tutor("Demo Tutor", "demo@instadog.com", "demo123", "São Paulo",
                    "Conta de demonstração do InstaDog. Entrei aqui para você testar a rede social sem criar conta.",
                    12),
            new Tutor("Ana Silva", "ana@instadog.com", "123456", "Rio de Janeiro",
                    "Tutora de duas SRDs, fotógrafa amadora e membro do clube de passeios do Parque Lage.", 5),
            new Tutor("Carlos Mendes", "carlos@instadog.com", "123456", "Belo Horizonte",
                    "Pai do Thor, o golden retriever que manda em tudo, inclusive na cozinha.", 3),
            new Tutor("Beatriz Costa", "bea@instadog.com", "123456", "Curitiba",
                    "Trilhas, café e a Frida. No parque, sempre com a câmera acesa.", 9),
            new Tutor("Rafael Lima", "rafael@instadog.com", "123456", "Recife",
                    "Resgatamos a Bolinha e a Pipoca. Sempre em busca de campos pet friendly.", 1),
            new Tutor("Júlia Almeida", "julia@instadog.com", "123456", "Porto Alegre",
                    "Golden, poodle e fotografia analógica. O caderno é mais velho que o celular.", 16),
            new Tutor("Marcos Pereira", "marcos@instadog.com", "123456", "Salvador",
                    "Dálmata, beagle e muita foto de orla no fim de tarde.", 7),
            new Tutor("Larissa Souza", "larissa@instadog.com", "123456", "Brasília",
                    "Rottweiler e labrador. Casa grande, cercado grande, muita bagunça de pelo.", 11),
            new Tutor("Pedro Henrique", "pedro@instadog.com", "123456", "Curitiba",
                    "Corgi, pug e uma casa inteira coberta de pelos.", 15),
            new Tutor("Camila Rocha", "camila@instadog.com", "123456", "Florianópolis",
                    "Surf, praia e um husky chamado Nêuton que não tem medo de água.", 14)
    );

    public static final List<Cao> CAOS = List.of(
            new Cao("demo@instadog.com", "Tobias", "Vira-lata (SRD)", LocalDate.of(2021, 5, 10), "Médio",
                    "Cão de todos os lugares. Prefere bancos de praça e acha que é dono do bairro.",
                    "https://images.dog.ceo/breeds/mix/roxy_1.jpg"),
            new Cao("demo@instadog.com", "Maya", "Husky Siberiano", LocalDate.of(2022, 11, 11), "Grande",
                    "Fala mais que a tutora. Precisa de parque todos os dias, sem exceção.",
                    "https://images.dog.ceo/breeds/husky/n02110185_2736.jpg"),

            new Cao("ana@instadog.com", "Rex", "Vira-lata (SRD)", LocalDate.of(2021, 5, 10), "Médio",
                    "Achou uma bola no parque e nunca mais devolveu.",
                    "https://images.dog.ceo/breeds/mix/marco2.jpg"),
            new Cao("ana@instadog.com", "Nina", "Poodle Toy", LocalDate.of(2024, 4, 12), "Pequeno",
                    "Aprendeu a abrir a geladeira. Desculpa, Nina.",
                    "https://images.dog.ceo/breeds/poodle-toy/n02113624_5523.jpg"),

            new Cao("carlos@instadog.com", "Thor", "Golden Retriever", LocalDate.of(2020, 11, 3), "Grande",
                    "Gentil demais para o próprio tamanho. O maior puxador de tapete da casa.",
                    "https://images.dog.ceo/breeds/retriever-golden/n02099601_7227.jpg"),

            new Cao("bea@instadog.com", "Frida", "Border Collie", LocalDate.of(2020, 3, 15), "Médio",
                    "Pastoreia tudo, inclusive a lava-louças.",
                    "https://images.dog.ceo/breeds/collie-border/n02106166_4450.jpg"),
            new Cao("bea@instadog.com", "Chico", "Chihuahua", LocalDate.of(2023, 11, 1), "Pequeno",
                    "Dois quilos e meio de pura opinião. Late quando alguém passa na calçada.",
                    "https://images.dog.ceo/breeds/chihuahua/n02085620_1073.jpg"),

            new Cao("rafael@instadog.com", "Bolinha", "Pug", LocalDate.of(2023, 1, 20), "Pequeno",
                    "Ronca dormindo. Ronca acordado também, de vez em quando.",
                    "https://images.dog.ceo/breeds/pug/n02110958_11261.jpg"),
            new Cao("rafael@instadog.com", "Pipoca", "Pekingês", LocalDate.of(2024, 2, 2), "Pequeno",
                    "Resgatada com três meses. Hoje é a rainha da casa.",
                    "https://images.dog.ceo/breeds/pekinese/n02086079_1820.jpg"),

            new Cao("julia@instadog.com", "Luna", "Poodle", LocalDate.of(2022, 2, 15), "Médio",
                    "Elegante, acorda às seis e cobra passeio na hora.",
                    "https://images.dog.ceo/breeds/poodle-standard/n02113799_1144.jpg"),
            new Cao("julia@instadog.com", "Jade", "Maltês", LocalDate.of(2023, 7, 19), "Pequeno",
                    "Laço rosa permanente. Nega o laço todo dia.",
                    "https://images.dog.ceo/breeds/maltese/n02085936_7394.jpg"),

            new Cao("marcos@instadog.com", "Mel", "Dálmata", LocalDate.of(2022, 6, 1), "Médio",
                    "Cada mancha tem nome. As favoritas são Pipoca e Café.",
                    "https://images.dog.ceo/breeds/dalmatian/cooper1.jpg"),
            new Cao("marcos@instadog.com", "Bento", "Beagle", LocalDate.of(2021, 10, 9), "Médio",
                    "Nariz que nunca desliga. Fareja lanche a três quadras de casa.",
                    "https://images.dog.ceo/breeds/beagle/n02088364_12440.jpg"),

            new Cao("larissa@instadog.com", "Simba", "Rottweiler", LocalDate.of(2021, 3, 22), "Grande",
                    "Briguento só no sofá. No resto do mundo, um anjo.",
                    "https://images.dog.ceo/breeds/rottweiler/n02106550_1260.jpg"),
            new Cao("larissa@instadog.com", "Amora", "Labrador", LocalDate.of(2020, 12, 25), "Grande",
                    "Filhote eterno, coração enorme. Busca a bolinha sem nunca trazer de volta.",
                    "https://images.dog.ceo/breeds/labrador/n02099712_4960.jpg"),

            new Cao("pedro@instadog.com", "Toby", "Welsh Corgi", LocalDate.of(2023, 5, 5), "Pequeno",
                    "Pernas curtas, opinião longa. Treme de alegria quando chega visita.",
                    "https://images.dog.ceo/breeds/pembroke/n02113023_894.jpg"),
            new Cao("pedro@instadog.com", "Fubá", "Pug", LocalDate.of(2022, 9, 14), "Pequeno",
                    "Dramático por natureza. Odeia o secador.",
                    "https://images.dog.ceo/breeds/pug/n02110958_12120.jpg"),

            new Cao("camila@instadog.com", "Nêuton", "Husky Siberiano", LocalDate.of(2021, 8, 8), "Grande",
                    "Surfa melhor que muita gente. Uiva junto com a espuma do mar.",
                    "https://images.dog.ceo/breeds/husky/n02110185_6094.jpg"),
            new Cao("camila@instadog.com", "Amelie", "Weimaraner", LocalDate.of(2022, 12, 3), "Grande",
                    "Pelo curto, cara de soneca. Fica ao lado da janela esperando alguém.",
                    "https://images.dog.ceo/breeds/weimaraner/n02092339_2691.jpg")
    );

    /**
     * Publicações em ordem cronológica decrescente (a primeira é a mais recente).
     * As publicações da conta demo ficam intercaladas entre os demais tutores,
     * para que o feed mostre interação entre pessoas diferentes já de cara.
     */
    public static final List<Post> POSTS = List.of(
            new Post("Tobias", "Primeiro dia no parque com o Tobias. Já escolheu a sombra como lugar oficial. 🌳",
                    "https://images.dog.ceo/breeds/mix/roxy_1.jpg"),
            new Post("Rex", "Achou a bola no parque e agora a missão é encontrar uma nova.",
                    "https://images.dog.ceo/breeds/mix/marco2.jpg"),
            new Post("Maya", "A Maya descobriu a neve e decidiu que era inimiga. ❄️",
                    "https://images.dog.ceo/breeds/husky/n02110185_2736.jpg"),
            new Post("Thor", "O Thor e o abraço de sempre: sessenta quilos de amor condensados numa tarde.",
                    "https://images.dog.ceo/breeds/retriever-golden/n02099601_7227.jpg"),
            new Post("Pipoca", "Resgatada com três meses. Hoje não sai do meu lado. 🥺",
                    "https://images.dog.ceo/breeds/pekinese/n02086079_1820.jpg"),
            new Post("Frida", "A Frida organizou as bolinhas por tamanho. Ninguém pediu isso. 🐕‍🦺",
                    "https://images.dog.ceo/breeds/collie-border/n02106166_4450.jpg"),
            new Post("Amora", "A Amora e a bolinha: uma busca, uma decepção e eu no meio.",
                    "https://images.dog.ceo/breeds/labrador/n02099712_4960.jpg"),

            new Post("Tobias", "Chuva de verão e cachorro deitado na janela, como manda a tradição.",
                    "https://images.dog.ceo/breeds/mix/bella.jpg"),
            new Post("Nina", "A Nina aprendeu a abrir a geladeira. Agora a culpa é minha. 😅",
                    "https://images.dog.ceo/breeds/poodle-toy/n02113624_5523.jpg"),
            new Post("Nêuton", "Surfe com o husky. A espuma do mar não assusta ele. 🏄",
                    "https://images.dog.ceo/breeds/husky/n02110185_6094.jpg"),
            new Post("Jade", "Laço rosa de sempre. Ela nega todos os dias. Todo dia vale.",
                    "https://images.dog.ceo/breeds/maltese/n02085936_7394.jpg"),
            new Post("Bento", "O farejador oficial. Achou o lanche a três quadras de casa.",
                    "https://images.dog.ceo/breeds/beagle/n02088364_12440.jpg"),
            new Post("Fubá", "O Fubá odeia o secador. E o Fubá tem razão.",
                    "https://images.dog.ceo/breeds/pug/n02110958_12120.jpg"),

            new Post("Maya", "Trilha de domingo: doze quilômetros e nem uma gota de água sobrou. 🥾",
                    "https://images.dog.ceo/breeds/husky/n02110185_13434.jpg"),
            new Post("Chico", "Dois quilos e meio de pura opinião. O porte nunca foi problema.",
                    "https://images.dog.ceo/breeds/chihuahua/n02085620_1073.jpg"),
            new Post("Simba", "Briguento no sofá, gigante na rua. O melhor dos dois mundos. 😄",
                    "https://images.dog.ceo/breeds/rottweiler/n02106550_1260.jpg"),
            new Post("Luna", "Poodle de exposição? Não, de passeio. Mas o laço sim. 🎀",
                    "https://images.dog.ceo/breeds/poodle-standard/n02113799_1144.jpg"),
            new Post("Mel", "Dálmata: cada mancha tem nome. As favoritas são Pipoca e Café. 🖤",
                    "https://images.dog.ceo/breeds/dalmatian/cooper1.jpg"),
            new Post("Toby", "Corgi em modo trabalho: perna curta, coração enorme.",
                    "https://images.dog.ceo/breeds/pembroke/n02113023_894.jpg"),
            new Post("Amelie", "Pelo curto, cara de soneca. Esperando alguém na porta da frente.",
                    "https://images.dog.ceo/breeds/weimaraner/n02092339_2691.jpg"),

            new Post("Bolinha", "Banho dado, toalha no corpo e expressão de quem foi traído.",
                    "https://images.dog.ceo/breeds/pug/n02110958_11261.jpg"),
            new Post("Thor", "Passeio na Serra da Canastra, com água de porão o caminho todo.",
                    "https://images.dog.ceo/breeds/retriever-golden/n02099601_7227.jpg"),
            new Post("Rex", "Domingo preguiçoso na varanda com o tutor.",
                    "https://images.dog.ceo/breeds/mix/marco2.jpg"),
            new Post("Mel", "Passeio na orla de Salvador com o sol do fim de tarde.",
                    "https://images.dog.ceo/breeds/dalmatian/cooper2.jpg"),
            new Post("Frida", "Trilha com a Frida e muita pressa no caminho. Cadê o lanche?",
                    "https://images.dog.ceo/breeds/collie/n02106030_15508.jpg"),
            new Post("Bolinha", "Soneca oficial do fim de semana.",
                    "https://images.dog.ceo/breeds/pug/n02110958_12080.jpg")
    );

    public static final List<Comentario> COMENTARIOS = List.of(
            new Comentario(0, "ana@instadog.com", "Que fofo! O Tobias tem cara de quem já é do time do parque 🐾"),
            new Comentario(0, "bea@instadog.com", "Meu Deus que fofura! O que uma sombra boa faz 😂"),
            new Comentario(1, "carlos@instadog.com", "Clássico! O Rex faz exatamente o mesmo kkkk"),
            new Comentario(2, "julia@instadog.com", "A neve é um personagem à parte, confesso que a Maya tem razão kkk"),
            new Comentario(3, "julia@instadog.com", "Golden retriever é um casulo de pelo que abraça ❤️"),
            new Comentario(4, "ana@instadog.com", "Chora, mas chora de alegria. Que história linda 💛"),
            new Comentario(5, "demo@instadog.com", "Border collie resolve problema que a gente nem percebeu kkk"),
            new Comentario(5, "rafael@instadog.com", "A Frida é mais organizada que eu, confesso"),
            new Comentario(6, "ana@instadog.com", "Essa cena é a minha vida diária kkkkk"),
            new Comentario(8, "pedro@instadog.com", "O Fubá também descobre todos os segredos da casa 💦"),
            new Comentario(9, "camila@instadog.com", "A Nêuton prefere o mar, sem dúvida 🌊"),
            new Comentario(10, "pedro@instadog.com", "A Jade também! some embaixo do sofá depois 🎀"),
            new Comentario(11, "larissa@instadog.com", "Beagle é um GPS de petisco kkkk"),
            new Comentario(12, "rafael@instadog.com", "Concordo, secador é tortura 💨"),
            new Comentario(13, "carlos@instadog.com", "Doze quilômetros! A Maya tem mais fôlego que eu 🏃"),
            new Comentario(15, "carlos@instadog.com", "O Thor também é assim! Deita e olha com aquela cara 🎭"),
            new Comentario(16, "camila@instadog.com", "A Luna usa laço todo dia, é regra da casa 🎀"),
            new Comentario(17, "camila@instadog.com", "Que história linda! A Nêuton tem uma mancha que parece um coração ❤️"),
            new Comentario(18, "demo@instadog.com", "O Toby prova que tamanho não limita nada 🐄"),
            new Comentario(19, "marcos@instadog.com", "A Mel faz exatamente isso o dia inteiro 🥺"),
            new Comentario(20, "marcos@instadog.com", "O pug é um ator nato, não tem jeito 😂"),
            new Comentario(25, "larissa@instadog.com", "Minha Amora também, mas no sofá 😴")
    );

    public static final List<Seguimento> SEGUIMENTOS = List.of(
            new Seguimento("demo@instadog.com", "ana@instadog.com"),
            new Seguimento("demo@instadog.com", "carlos@instadog.com"),
            new Seguimento("demo@instadog.com", "bea@instadog.com"),
            new Seguimento("demo@instadog.com", "julia@instadog.com"),
            new Seguimento("demo@instadog.com", "camila@instadog.com"),

            new Seguimento("ana@instadog.com", "demo@instadog.com"),
            new Seguimento("ana@instadog.com", "carlos@instadog.com"),
            new Seguimento("ana@instadog.com", "bea@instadog.com"),
            new Seguimento("ana@instadog.com", "rafael@instadog.com"),

            new Seguimento("carlos@instadog.com", "demo@instadog.com"),
            new Seguimento("carlos@instadog.com", "julia@instadog.com"),
            new Seguimento("carlos@instadog.com", "larissa@instadog.com"),

            new Seguimento("bea@instadog.com", "demo@instadog.com"),
            new Seguimento("bea@instadog.com", "ana@instadog.com"),
            new Seguimento("bea@instadog.com", "pedro@instadog.com"),

            new Seguimento("rafael@instadog.com", "ana@instadog.com"),
            new Seguimento("rafael@instadog.com", "pedro@instadog.com"),

            new Seguimento("julia@instadog.com", "carlos@instadog.com"),
            new Seguimento("julia@instadog.com", "demo@instadog.com"),

            new Seguimento("marcos@instadog.com", "camila@instadog.com"),
            new Seguimento("marcos@instadog.com", "larissa@instadog.com"),

            new Seguimento("larissa@instadog.com", "carlos@instadog.com"),
            new Seguimento("larissa@instadog.com", "marcos@instadog.com"),

            new Seguimento("pedro@instadog.com", "bea@instadog.com"),
            new Seguimento("pedro@instadog.com", "ana@instadog.com"),

            new Seguimento("camila@instadog.com", "marcos@instadog.com"),
            new Seguimento("camila@instadog.com", "demo@instadog.com")
    );

    /** Recados no estilo Orkut: texts curtos deixados no muro dos amigos. */
    public static final List<Scrap> SCRAPS = List.of(
            new Scrap("demo@instadog.com", "ana@instadog.com",
                    "oi!! passei aqui só pra deixar um recado. como estão os cachorros? 🐾"),
            new Scrap("demo@instadog.com", "carlos@instadog.com",
                    "esse cachorro é muito fofo!! te lembro demais kkk"),
            new Scrap("demo@instadog.com", "bea@instadog.com",
                    "deixando scrap pra vc ^^ abraço grande!"),
            new Scrap("demo@instadog.com", "julia@instadog.com",
                    "vc tem o cachorro mais bonito do InstaDog 🐶"),
            new Scrap("demo@instadog.com", "camila@instadog.com",
                    "tô precisando de indicação de pet shop bom, vc indica? 🐾"),
            new Scrap("demo@instadog.com", "rafael@instadog.com",
                    "seu cachorro é muito fofo!! te adiciono na cauda infinita"),
            new Scrap("demo@instadog.com", "pedro@instadog.com",
                    "hj vc tá mto cute, passa aqui mais vezes!"),
            new Scrap("demo@instadog.com", "marcos@instadog.com",
                    "bom dia! ontem o cachorro latiu a noite toda, o seu também? 😂"),
            new Scrap("demo@instadog.com", "larissa@instadog.com",
                    "achei seu perfil pelo cachorro, que fofo!"),

            new Scrap("ana@instadog.com", "demo@instadog.com",
                    "bora marcar um passeio no parque no domingo? 🐕"),
            new Scrap("ana@instadog.com", "carlos@instadog.com",
                    "kkkkk te lembro demais! bj"),
            new Scrap("carlos@instadog.com", "demo@instadog.com",
                    "que cachorro lindo, me manda mais foto!"),
            new Scrap("carlos@instadog.com", "ana@instadog.com",
                    "tô com indicação de pet shop ótimo, te mando por aqui"),
            new Scrap("bea@instadog.com", "demo@instadog.com",
                    "bora num passeio na sexta? o Toby adora o Tobias 🐾"),
            new Scrap("julia@instadog.com", "carlos@instadog.com",
                    "esse golden é o mais lindo do InstaDog, não tem concorrência"),
            new Scrap("rafael@instadog.com", "pedro@instadog.com",
                    "kkkk a Pipoca e o Fubá iam ser irmãos"),
            new Scrap("pedro@instadog.com", "demo@instadog.com",
                    "oi!! tudo bem? passei pra dar um oi 🐶"),
            new Scrap("marcos@instadog.com", "camila@instadog.com",
                    "a dálmata quer ser minha amiga, deixei ela no mural 🐶"),
            new Scrap("camila@instadog.com", "marcos@instadog.com",
                    "kkkk a Mel e a Nêuton iam se dar muito bem na praia"),
            new Scrap("larissa@instadog.com", "carlos@instadog.com",
                    "oi, adorei o perfil! seus cachorros são enormes 😂")
    );
}
