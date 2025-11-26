using Domain.Entities.Configurations;
using Domain.Entities.CandDocs;
using Domain.Entities.Localisation;
using Domain.Entities.Security;
using Microsoft.EntityFrameworkCore;


namespace Infrastructure.Context
{
    public class FsContext : DbContext
    {
        public FsContext(DbContextOptions<FsContext> options)
       : base(options)
        { }

        public DbSet<GlobalPerson> GlobalPeople { get; set; }
        public DbSet<Adress> Adresses { get; set; }
        public DbSet<Country> Countries { get; set; }
        public DbSet<Quarter> Quarters { get; set; }
        public DbSet<Region> Regions { get; set; }
        public DbSet<Town> Towns { get; set; }
        public DbSet<User> Users { get; set; }
        public DbSet<People> People { get; set; }
        public DbSet<Sex> Sexes { get; set; }
        public DbSet<Job> Jobs { get; set; }
        public DbSet<Branch> Branches { get; set; }

        public DbSet<Archive> Archives { get; set; }
       
        public DbSet<Company> Companies { get; set; }

        public DbSet<Profile> Profiles { get; set; }
        public DbSet<Module> Modules { get; set; }
        public DbSet<Menu> Menus { get; set; }
        public DbSet<SubMenu> SubMenus { get; set; }
        public DbSet<ActionMenuProfile> ActionMenuProfiles { get; set; }
        public DbSet<ActionSubMenuProfile> ActionSubMenuProfiles { get; set; }

        public DbSet<Mouchard> Mouchards { get; set; }

        // Mobilité et reconnaissance
        public DbSet<CandidateDocument> CandidateDocuments { get; set; }
        public DbSet<ExamCenter> ExamCenters { get; set; }
        //public DbSet<Candidate> Candidates { get; set; }
        //public DbSet<BatchUpload> BatchUploads { get; set; }


        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            foreach (var relationship in modelBuilder.Model.GetEntityTypes().SelectMany(e => e.GetForeignKeys()))
            {
                relationship.DeleteBehavior = DeleteBehavior.Restrict;
            }
            modelBuilder.Entity<GlobalPerson>().ToTable("GlobalPeople");
            modelBuilder.Entity<People>().ToTable("People");
            modelBuilder.Entity<User>().ToTable("Users");


            // Configure cascade delete from Menu to SubMenu
            modelBuilder.Entity<Menu>()
                .HasMany(m => m.SubMenus)
                .WithOne(sm => sm.Menu)
                .HasForeignKey(sm => sm.MenuID)
                .OnDelete(DeleteBehavior.Cascade);

            // Configure cascade delete from SubMenu to ActionSubMenuProfile
            modelBuilder.Entity<SubMenu>()
                .HasMany(sm => sm.ActionSubMenuProfiles)
                .WithOne(asp => asp.SubMenu)
                .HasForeignKey(asp => asp.SubMenuID)
                .OnDelete(DeleteBehavior.Cascade);

            // Configure cascade delete from Menu to ActionMenuProfile
            modelBuilder.Entity<Menu>()
                .HasMany(m => m.ActionMenuProfiles)
                .WithOne(amp => amp.Menu)
                .HasForeignKey(amp => amp.MenuID)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<Module>()
                .HasMany(m => m.Menus)
                .WithOne(amp => amp.Module)
                .HasForeignKey(amp => amp.ModuleID)
                .OnDelete(DeleteBehavior.Cascade);

        }

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            optionsBuilder.UseLazyLoadingProxies(true);
        }
    }


}

