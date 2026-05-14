package com.springsecurity.authsystem.config;

import com.springsecurity.authsystem.model.Roles;
import com.springsecurity.authsystem.repository.RoleRepo;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
public class DataSeeder implements CommandLineRunner {
    private final RoleRepo roleRepo;

    public DataSeeder(RoleRepo roleRepo) {
        this.roleRepo = roleRepo;
    }

    @Override
    public void run(String... args) throws Exception {
        if(roleRepo.findByName("ROLE_USER").isEmpty()){
            Roles userRole=new Roles();
            userRole.setName("ROLE_USER");
            roleRepo.save(userRole);
        }
        if(roleRepo.findByName("ROLE_ADMIN").isEmpty()){
            Roles adminRole=new Roles();
            adminRole.setName("ROLE_ADMIN");
            roleRepo.save(adminRole);
        }
    }
}
