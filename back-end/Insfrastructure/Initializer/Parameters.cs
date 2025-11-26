using Domain.Entities.Configurations;
using Domain.Entities.Localisation;
using Domain.Entities.Security;


namespace Insfrastructure.Initialiser
{
    internal static partial class Parameters
    {
        //country
        private static Country cameroon = new Country() { CountryCode = "CMR", CountryLabel = "Cameroon" };
        //regions
        private static Region northwest = new Region()
        {
            RegionCode = "NW",
            RegionLabel = "North West",
            Country = cameroon,
            CountryID = cameroon.CountryID

        };
        private static Region southwest = new Region()
        {
            RegionCode = "SW",
            RegionLabel = "South West",
            Country = cameroon,
            CountryID = cameroon.CountryID
        };
        
        public static List<Region> Regions
        {
            get
            {
                return new List<Region>() { northwest, southwest };
            }
        }
        /*======================================================================================*/

        /*============================== Towns initialization ==================================*/
        
        private static Town buea = new Town() { Region = southwest, RegionID = southwest.RegionID, TownCode = "BUEA", TownLabel = "BUEA" };
        
        public static List<Town> Towns
        {
            get
            {
                return new List<Town>()
                {
                     buea
                };
            }
        }
        /*=======================================================================================*/

        /*============================== Quarters initialization ===============================*/
       
        private static Quarter bueaMolyko = new Quarter() { QuarterCode = "Molyko", QuarterLabel = "molyko", Town = buea, TownID = buea.TownID };
        public static List<Quarter> Quarters
        {
            get
            {
                return new List<Quarter>()
                {
                    bueaMolyko
                };
            }
        }
        /*========================================================================================*/
        /*=========================== Company,Job and Branch initialization =================================*/
        
        private static Adress bueaHeadBranchAdress = new Adress()
        {
            AdressEmail = "info@camgceb.org",
            AdressPhoneNumber = "233 32 21 12",
            AdressPOBox = "10000",
            AdressFax = "",
            AdressCellNumber = "233 32 21 14",
            AdressFullName = "PMB 10,000 BUEA",
            Quarter = bueaMolyko,
            QuarterID = bueaMolyko.QuarterID
        };


        private static Archive defaultArchive = new Archive()
        {
            FileBase64 = "",
            FileName = "",
            ContentType = ""
        };

        private static Company defaultCompany = new Company()
        {

            CompanyCode = "GCE BOARD",
            CompanyName = "GENERAL CERTIFICATE OF EDUCATION BOARD",
            CompanyAbbreviation = "GCE BOARD",
            CompanyDescription = "GCE BOARD",
            Adress = bueaHeadBranchAdress,
            AdressID = bueaHeadBranchAdress.AdressID,
            ArchiveID = defaultArchive.ArchiveID,
            Archive = defaultArchive
        };



        private static Branch BuearHeadBranch = new Branch()
        {
            BranchName = "Head Branch",
            Company = defaultCompany,
            CompanyID = defaultCompany.CompanyID,
            BranchDescription = "Head Branch",
            BranchCode = "HEAD OFFICE",
            BranchAbbreviation = "HEAD OFFICE",
            Adress = bueaHeadBranchAdress,
            AdressID = bueaHeadBranchAdress.AdressID,

        };
        

        public static List<Branch> Branchs
        {
            get
            {
                return new List<Branch>() { BuearHeadBranch };
            }
        }



        /*=====================================================================================*/
        /*=========================== Profiles initialization =================================*/
        private static Profile administrator = new Profile()
        {
            ProfileCode = "admin-Dental",
            ProfileLabel = "Administrateur",
            ProfileLevel = 3,
            ProfileDescription = "Détient le contrôle sur toute l'application",
            ProfileState = true
        };

        private static Profile superAdministrator = new Profile()
        {
            ProfileCode = "Super-Admin-FSInventory",
            ProfileLabel = "Super Administrator",
            ProfileDescription = "Détient le contrôle sur toute l'application",
            ProfileState = true,
            ProfileLevel = 1,
        };

        private static Profile employee = new Profile()
        {
            ProfileCode = "Employé",
            ProfileLabel = "Employé",
            ProfileDescription = "Un employé de la compagnie qui ne peut se connecter à l'application",
            ProfileState = false
        };
        public static List<Profile> Profiles
        {
            get
            {
                return new List<Profile>() { superAdministrator, administrator, employee };
            }
        }
        /*======================== company and Jobs initialization ============================*/




        private static Job computeristJob = new Job()
        {
            JobLabel = "Computer Engineer",
            JobDescription = "Manage Information system",
            JobCode = "Info"
        };
       
        private static Job accountantJob = new Job()
        {
            JobLabel = "Accountant",
            JobDescription = "Manage Account",
            JobCode = "Accountant"
        };
        
        public static List<Job> Jobs
        {
            get
            {
                return new List<Job>() { computeristJob, accountantJob };
            }
        }






        /*============================== Users initialization =================================*/
        private static Sex masculin = new Sex() { SexCode = "M", SexLabel = "Masculin" };
        private static Sex feminin = new Sex() { SexCode = "F", SexLabel = "Feminin" };


        private static User superAdminAccount = new User()
        {
            CNI = "2244MRDF87955",
            Name = "Super",
            Description = "FATSOG GROUP SARL",
            Sex = masculin,
            SexID = masculin.SexID,
            IsConnected = true,
            AdressID = bueaHeadBranchAdress.AdressID,
            Adress = bueaHeadBranchAdress,
            UserAccountState = true,
            UserLogin = "fatsod15",
            UserPassword = "fatsod_inv",
            UserAccessLevel = 2,
            Profile = superAdministrator,
            ProfileID = superAdministrator.ProfileID,
            JobID = computeristJob.JobID,
            Job = computeristJob,
            BranchID = BuearHeadBranch.BranchID,
            Branch = BuearHeadBranch,
            Code = "SuperAdminCode15",
            IsMarketer = true,
           
        };
        private static User adminAccount = new User()
        {
            CNI = "12457DLA5",
            Name = "Admin",
            Description = "Admin Surname",
            Sex = masculin,
            SexID = masculin.SexID,
            IsConnected = true,
            AdressID = bueaHeadBranchAdress.AdressID,
            Adress = bueaHeadBranchAdress,
            UserAccountState = true,
            UserLogin = "dental",
            UserPassword = "dental",
            UserAccessLevel = 3,
            Profile = administrator,
            ProfileID = administrator.ProfileID,
            JobID = computeristJob.JobID,
            Job = computeristJob,
            Code = "AdminCode",
            BranchID = BuearHeadBranch.BranchID,
            Branch = BuearHeadBranch,
            IsMarketer = true,
            
        };


        public static List<Archive> Archives
        {
            get
            {
                return new List<Archive>() { defaultArchive };
            }
        }


        public static List<User> Users
        {
            get
            {
                return new List<User>() { superAdminAccount, adminAccount };
            }
        }

        public static List<Company> Companies
        {
            get
            {
                return new List<Company>() { defaultCompany };
            }
        }





        public static List<Sex> Sexes
        {
            get
            {
                return new List<Sex>() { feminin };
            }
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

