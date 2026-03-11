


-- CREATE DATABASE AssessmentDB;

-- USE AssessmentDB;



-- Create Department Table
IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[Department]') AND type in (N'U'))
BEGIN
    CREATE TABLE [dbo].[Department]
    (
        [Id]             INT            IDENTITY(1,1) NOT NULL,
        [DepartmentCode] NVARCHAR(20)   NOT NULL,
        [DepartmentName] NVARCHAR(100)  NOT NULL,
        [CreatedDate]    DATETIME2      NOT NULL DEFAULT GETUTCDATE(),
        [ModifiedDate]   DATETIME2      NULL,
        [IsActive]       BIT            NOT NULL DEFAULT 1,
        CONSTRAINT [PK_Department] PRIMARY KEY CLUSTERED ([Id] ASC),
        CONSTRAINT [UQ_Department_Code] UNIQUE ([DepartmentCode])
    );
END
GO


-- Create User Table
IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[User]') AND type in (N'U'))
BEGIN
    CREATE TABLE [dbo].[User]
    (
        [Id]           INT            IDENTITY(1,1) NOT NULL,
        [FirstName]    NVARCHAR(50)   NOT NULL,
        [LastName]     NVARCHAR(50)   NOT NULL,
        [EmailAddress] NVARCHAR(100)  NOT NULL,
        [DateOfBirth]  DATE           NOT NULL,
        [Salary]       DECIMAL(18,2)  NOT NULL,
        [DepartmentId] INT            NOT NULL,
        [CreatedDate]  DATETIME2      NOT NULL DEFAULT GETUTCDATE(),
        [ModifiedDate] DATETIME2      NULL,
        [IsActive]     BIT            NOT NULL DEFAULT 1,
        CONSTRAINT [PK_User] PRIMARY KEY CLUSTERED ([Id] ASC),
        CONSTRAINT [UQ_User_Email] UNIQUE ([EmailAddress]),
        CONSTRAINT [FK_User_Department] FOREIGN KEY ([DepartmentId])
            REFERENCES [dbo].[Department]([Id])
            ON DELETE NO ACTION
            ON UPDATE CASCADE
    );
END
GO


-- Create Index on User.DepartmentId
IF NOT EXISTS (SELECT * FROM sys.indexes WHERE name = 'IX_User_DepartmentId')
BEGIN
    CREATE NONCLUSTERED INDEX [IX_User_DepartmentId]
        ON [dbo].[User]([DepartmentId] ASC);
END
GO


-- Stored Procedures for Department

-- Get All Departments
IF OBJECT_ID('sp_GetAllDepartments', 'P') IS NOT NULL DROP PROCEDURE sp_GetAllDepartments;
GO
CREATE PROCEDURE sp_GetAllDepartments
AS
BEGIN
    SET NOCOUNT ON;
    SELECT Id, DepartmentCode, DepartmentName, CreatedDate, ModifiedDate, IsActive
    FROM [dbo].[Department]
    WHERE IsActive = 1
    ORDER BY DepartmentName;
END
GO

-- Get Department By Id
IF OBJECT_ID('sp_GetDepartmentById', 'P') IS NOT NULL DROP PROCEDURE sp_GetDepartmentById;
GO
CREATE PROCEDURE sp_GetDepartmentById
    @Id INT
AS
BEGIN
    SET NOCOUNT ON;
    SELECT Id, DepartmentCode, DepartmentName, CreatedDate, ModifiedDate, IsActive
    FROM [dbo].[Department]
    WHERE Id = @Id AND IsActive = 1;
END
GO

-- Create Department
IF OBJECT_ID('sp_CreateDepartment', 'P') IS NOT NULL DROP PROCEDURE sp_CreateDepartment;
GO
CREATE PROCEDURE sp_CreateDepartment
    @DepartmentCode NVARCHAR(20),
    @DepartmentName NVARCHAR(100)
AS
BEGIN
    SET NOCOUNT ON;

    IF EXISTS (SELECT 1 FROM [dbo].[Department] WHERE DepartmentCode = @DepartmentCode)
    BEGIN
        RAISERROR('Department code already exists.', 16, 1);
        RETURN;
    END

    INSERT INTO [dbo].[Department] (DepartmentCode, DepartmentName)
    VALUES (@DepartmentCode, @DepartmentName);

    SELECT SCOPE_IDENTITY() AS Id;
END
GO

-- Update Department
IF OBJECT_ID('sp_UpdateDepartment', 'P') IS NOT NULL DROP PROCEDURE sp_UpdateDepartment;
GO
CREATE PROCEDURE sp_UpdateDepartment
    @Id             INT,
    @DepartmentCode NVARCHAR(20),
    @DepartmentName NVARCHAR(100)
AS
BEGIN
    SET NOCOUNT ON;

    IF EXISTS (SELECT 1 FROM [dbo].[Department] WHERE DepartmentCode = @DepartmentCode AND Id <> @Id)
    BEGIN
        RAISERROR('Department code already exists.', 16, 1);
        RETURN;
    END

    UPDATE [dbo].[Department]
    SET DepartmentCode = @DepartmentCode,
        DepartmentName = @DepartmentName,
        ModifiedDate   = GETUTCDATE()
    WHERE Id = @Id AND IsActive = 1;

    SELECT @@ROWCOUNT AS RowsAffected;
END
GO

-- Delete Department
IF OBJECT_ID('sp_DeleteDepartment', 'P') IS NOT NULL DROP PROCEDURE sp_DeleteDepartment;
GO
CREATE PROCEDURE sp_DeleteDepartment
    @Id INT
AS
BEGIN
    SET NOCOUNT ON;

    IF EXISTS (SELECT 1 FROM [dbo].[User] WHERE DepartmentId = @Id AND IsActive = 1)
    BEGIN
        RAISERROR('Cannot delete department. Active users are assigned to this department.', 16, 1);
        RETURN;
    END

    UPDATE [dbo].[Department]
    SET IsActive     = 0,
        ModifiedDate = GETUTCDATE()
    WHERE Id = @Id AND IsActive = 1;

    SELECT @@ROWCOUNT AS RowsAffected;
END
GO


-- Stored Procedures for User

-- Get All Users
IF OBJECT_ID('sp_GetAllUsers', 'P') IS NOT NULL DROP PROCEDURE sp_GetAllUsers;
GO
CREATE PROCEDURE sp_GetAllUsers
AS
BEGIN
    SET NOCOUNT ON;
    SELECT u.Id, u.FirstName, u.LastName, u.EmailAddress, u.DateOfBirth, u.Salary,
           u.DepartmentId, d.DepartmentCode, d.DepartmentName,
           u.CreatedDate, u.ModifiedDate, u.IsActive
    FROM [dbo].[User] u
    INNER JOIN [dbo].[Department] d ON u.DepartmentId = d.Id
    WHERE u.IsActive = 1
    ORDER BY u.FirstName, u.LastName;
END
GO

-- Get User By Id
IF OBJECT_ID('sp_GetUserById', 'P') IS NOT NULL DROP PROCEDURE sp_GetUserById;
GO
CREATE PROCEDURE sp_GetUserById
    @Id INT
AS
BEGIN
    SET NOCOUNT ON;
    SELECT u.Id, u.FirstName, u.LastName, u.EmailAddress, u.DateOfBirth, u.Salary,
           u.DepartmentId, d.DepartmentCode, d.DepartmentName,
           u.CreatedDate, u.ModifiedDate, u.IsActive
    FROM [dbo].[User] u
    INNER JOIN [dbo].[Department] d ON u.DepartmentId = d.Id
    WHERE u.Id = @Id AND u.IsActive = 1;
END
GO

-- Create User
IF OBJECT_ID('sp_CreateUser', 'P') IS NOT NULL DROP PROCEDURE sp_CreateUser;
GO
CREATE PROCEDURE sp_CreateUser
    @FirstName    NVARCHAR(50),
    @LastName     NVARCHAR(50),
    @EmailAddress NVARCHAR(100),
    @DateOfBirth  DATE,
    @Salary       DECIMAL(18,2),
    @DepartmentId INT
AS
BEGIN
    SET NOCOUNT ON;

    IF EXISTS (SELECT 1 FROM [dbo].[User] WHERE EmailAddress = @EmailAddress)
    BEGIN
        RAISERROR('Email address already exists.', 16, 1);
        RETURN;
    END

    IF NOT EXISTS (SELECT 1 FROM [dbo].[Department] WHERE Id = @DepartmentId AND IsActive = 1)
    BEGIN
        RAISERROR('Invalid department.', 16, 1);
        RETURN;
    END

    INSERT INTO [dbo].[User] (FirstName, LastName, EmailAddress, DateOfBirth, Salary, DepartmentId)
    VALUES (@FirstName, @LastName, @EmailAddress, @DateOfBirth, @Salary, @DepartmentId);

    SELECT SCOPE_IDENTITY() AS Id;
END
GO

-- Update User
IF OBJECT_ID('sp_UpdateUser', 'P') IS NOT NULL DROP PROCEDURE sp_UpdateUser;
GO
CREATE PROCEDURE sp_UpdateUser
    @Id           INT,
    @FirstName    NVARCHAR(50),
    @LastName     NVARCHAR(50),
    @EmailAddress NVARCHAR(100),
    @DateOfBirth  DATE,
    @Salary       DECIMAL(18,2),
    @DepartmentId INT
AS
BEGIN
    SET NOCOUNT ON;

    IF EXISTS (SELECT 1 FROM [dbo].[User] WHERE EmailAddress = @EmailAddress AND Id <> @Id)
    BEGIN
        RAISERROR('Email address already exists.', 16, 1);
        RETURN;
    END

    IF NOT EXISTS (SELECT 1 FROM [dbo].[Department] WHERE Id = @DepartmentId AND IsActive = 1)
    BEGIN
        RAISERROR('Invalid department.', 16, 1);
        RETURN;
    END

    UPDATE [dbo].[User]
    SET FirstName    = @FirstName,
        LastName     = @LastName,
        EmailAddress = @EmailAddress,
        DateOfBirth  = @DateOfBirth,
        Salary       = @Salary,
        DepartmentId = @DepartmentId,
        ModifiedDate = GETUTCDATE()
    WHERE Id = @Id AND IsActive = 1;

    SELECT @@ROWCOUNT AS RowsAffected;
END
GO

-- Delete User (Soft Delete)
IF OBJECT_ID('sp_DeleteUser', 'P') IS NOT NULL DROP PROCEDURE sp_DeleteUser;
GO
CREATE PROCEDURE sp_DeleteUser
    @Id INT
AS
BEGIN
    SET NOCOUNT ON;

    UPDATE [dbo].[User]
    SET IsActive     = 0,
        ModifiedDate = GETUTCDATE()
    WHERE Id = @Id AND IsActive = 1;

    SELECT @@ROWCOUNT AS RowsAffected;
END
GO


-- Seed Data

IF NOT EXISTS (SELECT 1 FROM [dbo].[Department])
BEGIN
    INSERT INTO [dbo].[Department] (DepartmentCode, DepartmentName) VALUES ('HR', 'Human Resources');
    INSERT INTO [dbo].[Department] (DepartmentCode, DepartmentName) VALUES ('IT', 'Information Technology');
    INSERT INTO [dbo].[Department] (DepartmentCode, DepartmentName) VALUES ('FIN', 'Finance');
    INSERT INTO [dbo].[Department] (DepartmentCode, DepartmentName) VALUES ('MKT', 'Marketing');
    INSERT INTO [dbo].[Department] (DepartmentCode, DepartmentName) VALUES ('OPS', 'Operations');
END
GO


-- Seed User Data
IF NOT EXISTS (SELECT 1 FROM [dbo].[User])
BEGIN
    INSERT INTO [dbo].[User] (FirstName, LastName, EmailAddress, DateOfBirth, Salary, DepartmentId)
    VALUES ('John', 'Doe', 'john.doe@company.com', '1990-05-15', 75000.00, 2);

    INSERT INTO [dbo].[User] (FirstName, LastName, EmailAddress, DateOfBirth, Salary, DepartmentId)
    VALUES ('Jane', 'Smith', 'jane.smith@company.com', '1985-11-22', 82000.00, 1);

    INSERT INTO [dbo].[User] (FirstName, LastName, EmailAddress, DateOfBirth, Salary, DepartmentId)
    VALUES ('Michael', 'Johnson', 'michael.johnson@company.com', '1992-03-08', 68000.00, 3);
END
GO
