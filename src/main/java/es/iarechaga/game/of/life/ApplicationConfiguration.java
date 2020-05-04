package es.iarechaga.game.of.life;

import es.iarechaga.game.of.life.storage.SquaredPetriDish;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Configuration;

@Configuration
@ComponentScan(basePackages = "es.iarechaga.game.of.life")
public class ApplicationConfiguration {

    @Bean
    public SquaredPetriDish configureDish() {
        return new SquaredPetriDish(20);
    }
}
