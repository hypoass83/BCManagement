
using Infrastructure.Context;
using Domain.Entities.Localisation;
using Domain.Entities.Security;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using ZXing.QrCode.Internal;



namespace Insfrastructure.Initialiser
{
    public static class InventoryInitializer
    {
        public static void Seed(FsContext context, IPasswordHasher<User> _passwordHasher)
        {

            context.Database.EnsureCreated();


            if (!context.Regions.Any())
            {
                context.Regions.AddRange(Parameters.Regions);
            }

            if (!context.Towns.Any())
            {
                context.Towns.AddRange(Parameters.Towns);
            }



            if (!context.Quarters.Any())
            {
                context.Quarters.AddRange(Parameters.Quarters);
            }

            if (!context.Archives.Any())
            {
                context.Archives.AddRange(Parameters.Archives);
            }
            context.SaveChanges();

            if (!context.Companies.Any())
            {
                context.Companies.AddRange(Parameters.Companies);
            }
            context.SaveChanges();

            

            /*========================= Profile initialization===================================*/


            if (!context.Branches.Any())
            {
                context.Branches.AddRange(Parameters.Branchs);
            }

            /*========================= Profile initialization===================================*/



            if (!context.Profiles.Any())
            {
                context.Profiles.AddRange(Parameters.Profiles);
            }
            /*========================= Job Initialisation ======================================*/

            if (!context.Jobs.Any())
            {
                context.Jobs.AddRange(Parameters.Jobs);
            }



            ///*=========================== User Admin initialization =============================*/

            if (!context.Sexes.Any())
            {
                context.Sexes.AddRange(Parameters.Sexes);
            }


            // Idempotent seeding for Users: for each user in Parameters.Users,
            // - if not present in DB: hash the plaintext password and add the user
            // - if present: verify the stored password against the plaintext from Parameters; if it doesn't match, re-hash
            foreach (var paramUser in Parameters.Users)
            {
                var usersToSeed = CloneUser(paramUser);


                var existing = context.Users.SingleOrDefault(u => u.UserLogin == usersToSeed.UserLogin);
                if (existing == null)
                {
                    if (!string.IsNullOrEmpty(usersToSeed.UserPassword))
                    {
                        usersToSeed.UserPassword = _passwordHasher.HashPassword(usersToSeed, usersToSeed.UserPassword);
                    }
                    context.Users.Add(usersToSeed);
                }
                else
                {
                    // If we have a plaintext in parameters, verify existing hash against it.
                    if (!string.IsNullOrEmpty(usersToSeed.UserPassword))
                    {
                        var verification = _passwordHasher.VerifyHashedPassword(existing, existing.UserPassword ?? string.Empty, usersToSeed.UserPassword);
                        if (verification == PasswordVerificationResult.Failed)
                        {
                            // Re-hash using the known plaintext to ensure consistency
                            existing.UserPassword = _passwordHasher.HashPassword(existing, usersToSeed.UserPassword);
                        }
                    }
                }
            }

            context.SaveChanges();

        }

        private static User CloneUser(User source)
        {
            return new User
            {
                CNI = source.CNI,
                Name = source.Name,
                Description = source.Description,
                Sex = source.Sex,
                SexID = source.SexID,
                IsConnected = source.IsConnected,
                AdressID = source.AdressID,
                Adress = source.Adress,
                UserAccountState = source.UserAccountState,
                UserLogin = source.UserLogin,
                UserPassword = source.UserPassword, // keep plaintext until hashed
                UserAccessLevel = source.UserAccessLevel,
                Profile = source.Profile,
                ProfileID = source.ProfileID,
                JobID = source.JobID,
                Job = source.Job,
                BranchID = source.BranchID,
                Branch = source.Branch,
                Code = source.Code,
                IsMarketer = source.IsMarketer,
                // Copy other optional fields if needed
            };
        }
    }



}
