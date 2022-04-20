---
layout: ../../layouts/post.astro
image: /images/logos/c-sharp.svg
title: AWS and Azure Dependency Injection with .NET Core
description: AWS and Azure Dependency Injection with .NET Core
publishDate: 23 Jun 2019
---

# {frontmatter.title}

###### {frontmatter.publishDate}

## Install Packages

1. Run `dotnet add package AWSSDK.Extensions.NETCore.Setup`
1. Run `dotnet add package AWSSDK.EC2`
1. Run `dotnet add package Microsoft.Azure.Management.Fluent`

## App Configuration

Add the following JSON objects to `appsettings.json`, and `appsettings.Development.json`, and set the values accordingly:

```json
"AWS": {
  "Profile": "",
  "Region": ""
},
"Azure": {
  "ClientId": "",
  "ClientSecret": "",
  "TenantId": "",
  "SubscriptionId": ""
}
```

Append `.ConfigureAppConfiguration` to the `WebHost.CreateDefaultBuilder` method in `Program.cs`:

```csharp
.ConfigureAppConfiguration((hostingContext, config) =>
{
    config.SetBasePath(Directory.GetCurrentDirectory());
    config.AddJsonFile("appsettings.json", optional: false, reloadOnChange: true);
    config.AddJsonFile($"appsettings.{hostingContext.HostingEnvironment.EnvironmentName}.json", optional: true, reloadOnChange: true);
})
```

## Register Services

Register the AWS, and Azure services by adding the following to the `ConfigureServices` method in `Startup.cs`.

```csharp
// AWS
services.AddDefaultAWSOptions(Configuration.GetAWSOptions());
services.AddAWSService<IAmazonEC2>();

// Azure
var azureCredentials = SdkContext.AzureCredentialsFactory
    .FromServicePrincipal(Configuration.GetSection("Azure:ClientId").Value, Configuration.GetSection("Azure:ClientSecret").Value, Configuration.GetSection("Azure:TenantId").Value, AzureEnvironment.AzureGlobalCloud)
    .WithDefaultSubscription(Configuration.GetSection("Azure:SubscriptionId").Value);

services.AddSingleton(serviceProvider => Microsoft.Azure.Management.Fluent.Azure
    .Configure()
    .Authenticate(azureCredentials)
    .WithSubscription(azureCredentials.DefaultSubscriptionId));
```

## Example Usage

```csharp
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Amazon.EC2;
using Amazon.EC2.Model;
using Microsoft.AspNetCore.Mvc;

namespace Example.Controllers
{
    [Route("api/[controller]")]
    public class AwsController : Controller
    {
        public AwsController(IAmazonEC2 amazonEc2)
        {
            ec2 = ec2;
        }

        private IAmazonEC2 ec2 { get; }

        [HttpGet("[action]")]
        public async Task<IEnumerable<Instance>> Instances()
        {
            var instances = await ec2.DescribeInstancesAsync();
            return instances.Reservations.SelectMany(i => i.Instances);
        }
    }
}
```
