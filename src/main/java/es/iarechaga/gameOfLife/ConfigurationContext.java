package es.iarechaga.gameOfLife;

import es.iarechaga.gameOfLife.storage.SquaredPetriDish;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Configuration;

@Configuration
@ComponentScan(basePackages = "es.iarechaga.gameOfLife")
public class ConfigurationContext {

    @Bean
    public SquaredPetriDish configureDish() {
        return new SquaredPetriDish(20);
    }
}
