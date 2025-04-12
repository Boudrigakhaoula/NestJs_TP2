import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  private users: User[] = []; // Typage explicite avec User[]
  private idCounter = 1;

  // Créer un utilisateur
  create(createUserDto: CreateUserDto): User {
    const user: User = {
      id: this.idCounter++,
      ...createUserDto,
      createdAt: new Date(),
    };
    this.users.push(user);
    return user;
  }

  // Récupérer tous les utilisateurs
  findAll(): User[] {
    return this.users;
  }

  // Récupérer un utilisateur par ID
  findOne(id: number): User {
    const user = this.users.find((u) => u.id === id);
    if (!user) {
      throw new NotFoundException(`Utilisateur avec l'ID ${id} non trouvé`);
    }
    return user;
  }

  // Mettre à jour un utilisateur
  update(id: number, updateUserDto: UpdateUserDto): User {
    const userIndex = this.users.findIndex((u) => u.id === id);
    if (userIndex === -1) {
      throw new NotFoundException(`Utilisateur avec l'ID ${id} non trouvé`);
    }
    this.users[userIndex] = {
      ...this.users[userIndex],
      ...updateUserDto,
      updatedAt: new Date(),
    };
    return this.users[userIndex];
  }

  // Supprimer un utilisateur
  remove(id: number): User {
    const userIndex = this.users.findIndex((u) => u.id === id);
    if (userIndex === -1) {
      throw new NotFoundException(`Utilisateur avec l'ID ${id} non trouvé`);
    }
    const user = this.users.splice(userIndex, 1)[0];
    return user;
  }
}