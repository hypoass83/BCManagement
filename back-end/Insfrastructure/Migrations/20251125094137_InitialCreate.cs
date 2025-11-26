using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Insfrastructure.Migrations
{
    /// <inheritdoc />
    public partial class InitialCreate : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Archives",
                columns: table => new
                {
                    ArchiveID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    FileName = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    FileBase64 = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    ContentType = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Archives", x => x.ArchiveID);
                });

            migrationBuilder.CreateTable(
                name: "Countries",
                columns: table => new
                {
                    CountryID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    CountryCode = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    CountryLabel = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Countries", x => x.CountryID);
                });

            migrationBuilder.CreateTable(
                name: "ExamCenters",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    CenterNumber = table.Column<int>(type: "int", nullable: false),
                    CenterName = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Region = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Division = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    SubDivision = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ExamCenters", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Jobs",
                columns: table => new
                {
                    JobID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    JobLabel = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    JobDescription = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    JobCode = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Jobs", x => x.JobID);
                });

            migrationBuilder.CreateTable(
                name: "Modules",
                columns: table => new
                {
                    ModuleID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    ModuleCode = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    ModuleLabel = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    ModuleDescription = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    ModuleImagePath = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    ModulePressedImagePath = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    ModuleDisabledImagePath = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    ModuleArea = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    ModuleState = table.Column<bool>(type: "bit", nullable: false),
                    AppearanceOrder = table.Column<int>(type: "int", nullable: false),
                    ModuleStatus = table.Column<bool>(type: "bit", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Modules", x => x.ModuleID);
                });

            migrationBuilder.CreateTable(
                name: "Profiles",
                columns: table => new
                {
                    ProfileID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    ProfileCode = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    ProfileLabel = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    ProfileDescription = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    ProfileState = table.Column<bool>(type: "bit", nullable: false),
                    ProfileLevel = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Profiles", x => x.ProfileID);
                });

            migrationBuilder.CreateTable(
                name: "Sexes",
                columns: table => new
                {
                    SexID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    SexLabel = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    SexCode = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Sexes", x => x.SexID);
                });

            migrationBuilder.CreateTable(
                name: "Regions",
                columns: table => new
                {
                    RegionID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    RegionCode = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    RegionLabel = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    CountryID = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Regions", x => x.RegionID);
                    table.ForeignKey(
                        name: "FK_Regions_Countries_CountryID",
                        column: x => x.CountryID,
                        principalTable: "Countries",
                        principalColumn: "CountryID",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "Menus",
                columns: table => new
                {
                    MenuID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    MenuCode = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    MenuLabel = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    MenuDescription = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    MenuController = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    MenuState = table.Column<bool>(type: "bit", nullable: false),
                    MenuFlat = table.Column<bool>(type: "bit", nullable: false),
                    MenuPath = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    MenuIconName = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    IsShortcut = table.Column<int>(type: "int", nullable: false),
                    ModuleID = table.Column<int>(type: "int", nullable: false),
                    AppearanceOrder = table.Column<int>(type: "int", nullable: false),
                    MenuStatus = table.Column<bool>(type: "bit", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Menus", x => x.MenuID);
                    table.ForeignKey(
                        name: "FK_Menus_Modules_ModuleID",
                        column: x => x.ModuleID,
                        principalTable: "Modules",
                        principalColumn: "ModuleID",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Towns",
                columns: table => new
                {
                    TownID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    TownCode = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    TownLabel = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    RegionID = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Towns", x => x.TownID);
                    table.ForeignKey(
                        name: "FK_Towns_Regions_RegionID",
                        column: x => x.RegionID,
                        principalTable: "Regions",
                        principalColumn: "RegionID",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "ActionMenuProfiles",
                columns: table => new
                {
                    ActionMenuProfileID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Delete = table.Column<bool>(type: "bit", nullable: false),
                    Add = table.Column<bool>(type: "bit", nullable: false),
                    Update = table.Column<bool>(type: "bit", nullable: false),
                    MenuID = table.Column<int>(type: "int", nullable: false),
                    ProfileID = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ActionMenuProfiles", x => x.ActionMenuProfileID);
                    table.ForeignKey(
                        name: "FK_ActionMenuProfiles_Menus_MenuID",
                        column: x => x.MenuID,
                        principalTable: "Menus",
                        principalColumn: "MenuID",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_ActionMenuProfiles_Profiles_ProfileID",
                        column: x => x.ProfileID,
                        principalTable: "Profiles",
                        principalColumn: "ProfileID",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "SubMenus",
                columns: table => new
                {
                    SubMenuID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    SubMenuCode = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    SubMenuLabel = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    SubMenuDescription = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    SubMenuController = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    SubMenuState = table.Column<bool>(type: "bit", nullable: false),
                    SubMenuPath = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    SubMenuIcon = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    IsChortcut = table.Column<bool>(type: "bit", nullable: false),
                    MenuID = table.Column<int>(type: "int", nullable: false),
                    AppearanceOrder = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_SubMenus", x => x.SubMenuID);
                    table.ForeignKey(
                        name: "FK_SubMenus_Menus_MenuID",
                        column: x => x.MenuID,
                        principalTable: "Menus",
                        principalColumn: "MenuID",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Quarters",
                columns: table => new
                {
                    QuarterID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    QuarterCode = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    QuarterLabel = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    TownID = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Quarters", x => x.QuarterID);
                    table.ForeignKey(
                        name: "FK_Quarters_Towns_TownID",
                        column: x => x.TownID,
                        principalTable: "Towns",
                        principalColumn: "TownID",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "ActionSubMenuProfiles",
                columns: table => new
                {
                    ActionSubMenuProfileID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Delete = table.Column<bool>(type: "bit", nullable: false),
                    Add = table.Column<bool>(type: "bit", nullable: false),
                    Update = table.Column<bool>(type: "bit", nullable: false),
                    SubMenuID = table.Column<int>(type: "int", nullable: false),
                    ProfileID = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ActionSubMenuProfiles", x => x.ActionSubMenuProfileID);
                    table.ForeignKey(
                        name: "FK_ActionSubMenuProfiles_Profiles_ProfileID",
                        column: x => x.ProfileID,
                        principalTable: "Profiles",
                        principalColumn: "ProfileID",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_ActionSubMenuProfiles_SubMenus_SubMenuID",
                        column: x => x.SubMenuID,
                        principalTable: "SubMenus",
                        principalColumn: "SubMenuID",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Adresses",
                columns: table => new
                {
                    AdressID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    AdressPhoneNumber = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    AdressCellNumber = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    AdressFullName = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    AdressEmail = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    AdressWebSite = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    AdressPOBox = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    AdressFax = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    QuarterID = table.Column<int>(type: "int", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Adresses", x => x.AdressID);
                    table.ForeignKey(
                        name: "FK_Adresses_Quarters_QuarterID",
                        column: x => x.QuarterID,
                        principalTable: "Quarters",
                        principalColumn: "QuarterID",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "Companies",
                columns: table => new
                {
                    CompanyID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    CompanyCode = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    CompanyName = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    CompanyAbbreviation = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    CompanyDescription = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    AdressID = table.Column<int>(type: "int", nullable: true),
                    ArchiveID = table.Column<int>(type: "int", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Companies", x => x.CompanyID);
                    table.ForeignKey(
                        name: "FK_Companies_Adresses_AdressID",
                        column: x => x.AdressID,
                        principalTable: "Adresses",
                        principalColumn: "AdressID",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_Companies_Archives_ArchiveID",
                        column: x => x.ArchiveID,
                        principalTable: "Archives",
                        principalColumn: "ArchiveID",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "GlobalPeople",
                columns: table => new
                {
                    GlobalPersonID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Name = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Tiergroup = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Description = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    CNI = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: true),
                    AdressID = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_GlobalPeople", x => x.GlobalPersonID);
                    table.ForeignKey(
                        name: "FK_GlobalPeople_Adresses_AdressID",
                        column: x => x.AdressID,
                        principalTable: "Adresses",
                        principalColumn: "AdressID",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "Branches",
                columns: table => new
                {
                    BranchID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    BranchCode = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    BranchAbbreviation = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    BranchName = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    BranchDescription = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    AdressID = table.Column<int>(type: "int", nullable: false),
                    CompanyID = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Branches", x => x.BranchID);
                    table.ForeignKey(
                        name: "FK_Branches_Adresses_AdressID",
                        column: x => x.AdressID,
                        principalTable: "Adresses",
                        principalColumn: "AdressID",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_Branches_Companies_CompanyID",
                        column: x => x.CompanyID,
                        principalTable: "Companies",
                        principalColumn: "CompanyID",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "People",
                columns: table => new
                {
                    GlobalPersonID = table.Column<int>(type: "int", nullable: false),
                    IsConnected = table.Column<bool>(type: "bit", nullable: false),
                    IsMarketer = table.Column<bool>(type: "bit", nullable: false),
                    IsSeller = table.Column<bool>(type: "bit", nullable: false),
                    SexID = table.Column<int>(type: "int", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_People", x => x.GlobalPersonID);
                    table.ForeignKey(
                        name: "FK_People_GlobalPeople_GlobalPersonID",
                        column: x => x.GlobalPersonID,
                        principalTable: "GlobalPeople",
                        principalColumn: "GlobalPersonID",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_People_Sexes_SexID",
                        column: x => x.SexID,
                        principalTable: "Sexes",
                        principalColumn: "SexID",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "Users",
                columns: table => new
                {
                    GlobalPersonID = table.Column<int>(type: "int", nullable: false),
                    Code = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    UserLogin = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    UserPassword = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    UserAccessLevel = table.Column<int>(type: "int", nullable: false),
                    UserAccountState = table.Column<bool>(type: "bit", nullable: false),
                    JobID = table.Column<int>(type: "int", nullable: false),
                    ProfileID = table.Column<int>(type: "int", nullable: true),
                    BranchID = table.Column<int>(type: "int", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Users", x => x.GlobalPersonID);
                    table.ForeignKey(
                        name: "FK_Users_Branches_BranchID",
                        column: x => x.BranchID,
                        principalTable: "Branches",
                        principalColumn: "BranchID",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_Users_Jobs_JobID",
                        column: x => x.JobID,
                        principalTable: "Jobs",
                        principalColumn: "JobID",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_Users_People_GlobalPersonID",
                        column: x => x.GlobalPersonID,
                        principalTable: "People",
                        principalColumn: "GlobalPersonID",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_Users_Profiles_ProfileID",
                        column: x => x.ProfileID,
                        principalTable: "Profiles",
                        principalColumn: "ProfileID",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "CandidateDocuments",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Session = table.Column<int>(type: "int", nullable: false),
                    CentreCode = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    CandidateNumber = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    CandidateName = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    FilePath = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    OcrText = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    UserId = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_CandidateDocuments", x => x.Id);
                    table.ForeignKey(
                        name: "FK_CandidateDocuments_Users_UserId",
                        column: x => x.UserId,
                        principalTable: "Users",
                        principalColumn: "GlobalPersonID",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "Mouchards",
                columns: table => new
                {
                    MouchardID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    MoucharDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    SneackHour = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    UserID = table.Column<int>(type: "int", nullable: true),
                    MoucharAction = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    MoucharDescription = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    MoucharOperationType = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    MoucharProcedureName = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    MoucharHost = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    MoucharHostAdress = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    BranchID = table.Column<int>(type: "int", nullable: true),
                    MoucharBusinessDate = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Mouchards", x => x.MouchardID);
                    table.ForeignKey(
                        name: "FK_Mouchards_Branches_BranchID",
                        column: x => x.BranchID,
                        principalTable: "Branches",
                        principalColumn: "BranchID",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_Mouchards_Users_UserID",
                        column: x => x.UserID,
                        principalTable: "Users",
                        principalColumn: "GlobalPersonID",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateIndex(
                name: "IX_ActionMenuProfiles_MenuID",
                table: "ActionMenuProfiles",
                column: "MenuID");

            migrationBuilder.CreateIndex(
                name: "IX_ActionMenuProfiles_ProfileID",
                table: "ActionMenuProfiles",
                column: "ProfileID");

            migrationBuilder.CreateIndex(
                name: "IX_ActionSubMenuProfiles_ProfileID",
                table: "ActionSubMenuProfiles",
                column: "ProfileID");

            migrationBuilder.CreateIndex(
                name: "IX_ActionSubMenuProfiles_SubMenuID",
                table: "ActionSubMenuProfiles",
                column: "SubMenuID");

            migrationBuilder.CreateIndex(
                name: "IX_Adresses_QuarterID",
                table: "Adresses",
                column: "QuarterID");

            migrationBuilder.CreateIndex(
                name: "IX_Branches_AdressID",
                table: "Branches",
                column: "AdressID");

            migrationBuilder.CreateIndex(
                name: "IX_Branches_CompanyID",
                table: "Branches",
                column: "CompanyID");

            migrationBuilder.CreateIndex(
                name: "IX_CandidateDocuments_UserId",
                table: "CandidateDocuments",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "IX_Companies_AdressID",
                table: "Companies",
                column: "AdressID");

            migrationBuilder.CreateIndex(
                name: "IX_Companies_ArchiveID",
                table: "Companies",
                column: "ArchiveID");

            migrationBuilder.CreateIndex(
                name: "IX_GlobalPeople_AdressID",
                table: "GlobalPeople",
                column: "AdressID");

            migrationBuilder.CreateIndex(
                name: "IX_Menus_ModuleID",
                table: "Menus",
                column: "ModuleID");

            migrationBuilder.CreateIndex(
                name: "IX_Mouchards_BranchID",
                table: "Mouchards",
                column: "BranchID");

            migrationBuilder.CreateIndex(
                name: "IX_Mouchards_UserID",
                table: "Mouchards",
                column: "UserID");

            migrationBuilder.CreateIndex(
                name: "IX_People_SexID",
                table: "People",
                column: "SexID");

            migrationBuilder.CreateIndex(
                name: "IX_Quarters_TownID",
                table: "Quarters",
                column: "TownID");

            migrationBuilder.CreateIndex(
                name: "IX_Regions_CountryID",
                table: "Regions",
                column: "CountryID");

            migrationBuilder.CreateIndex(
                name: "IX_SubMenus_MenuID",
                table: "SubMenus",
                column: "MenuID");

            migrationBuilder.CreateIndex(
                name: "IX_Towns_RegionID",
                table: "Towns",
                column: "RegionID");

            migrationBuilder.CreateIndex(
                name: "IX_Users_BranchID",
                table: "Users",
                column: "BranchID");

            migrationBuilder.CreateIndex(
                name: "IX_Users_JobID",
                table: "Users",
                column: "JobID");

            migrationBuilder.CreateIndex(
                name: "IX_Users_ProfileID",
                table: "Users",
                column: "ProfileID");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "ActionMenuProfiles");

            migrationBuilder.DropTable(
                name: "ActionSubMenuProfiles");

            migrationBuilder.DropTable(
                name: "CandidateDocuments");

            migrationBuilder.DropTable(
                name: "Mouchards");

            migrationBuilder.DropTable(
                name: "SubMenus");

            migrationBuilder.DropTable(
                name: "ExamCenters");

            migrationBuilder.DropTable(
                name: "Users");

            migrationBuilder.DropTable(
                name: "Menus");

            migrationBuilder.DropTable(
                name: "Branches");

            migrationBuilder.DropTable(
                name: "Jobs");

            migrationBuilder.DropTable(
                name: "People");

            migrationBuilder.DropTable(
                name: "Profiles");

            migrationBuilder.DropTable(
                name: "Modules");

            migrationBuilder.DropTable(
                name: "Companies");

            migrationBuilder.DropTable(
                name: "GlobalPeople");

            migrationBuilder.DropTable(
                name: "Sexes");

            migrationBuilder.DropTable(
                name: "Archives");

            migrationBuilder.DropTable(
                name: "Adresses");

            migrationBuilder.DropTable(
                name: "Quarters");

            migrationBuilder.DropTable(
                name: "Towns");

            migrationBuilder.DropTable(
                name: "Regions");

            migrationBuilder.DropTable(
                name: "Countries");
        }
    }
}
