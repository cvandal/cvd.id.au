---
title: "AWS, and Azure Dependency Injection with .NET Core"
date: 2019-06-23T18:12:47+10:00
tags: ["AWS", "Azure", ".NET Core"]
image: "/images/dot-net-core.png"
draft: false
---

### Install Packages

From the root directory of your project, run the following commands to install the prerequisite packages:

`dotnet add package AWSSDK.Extensions.NETCore.Setup`

`dotnet add package AWSSDK.EC2`

`dotnet add package Microsoft.Azure.Management.Fluent`

### App Configuration

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

Append `ConfigureAppConfiguration` to the `WebHost.CreateDefaultBuilder` method in `Program.cs`:

```c#
.ConfigureAppConfiguration((hostingContext, config) =>
{
    config.SetBasePath(Directory.GetCurrentDirectory());
    config.AddJsonFile("appsettings.json", optional: false, reloadOnChange: true);
    config.AddJsonFile($"appsettings.{hostingContext.HostingEnvironment.EnvironmentName}.json", optional: true, reloadOnChange: true);
})
```

### Register Services

Register the AWS, and Azure services by adding the following to the `ConfigureServices` method in `Startup.cs` class.

```c#
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

### Sample Application

```c#
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Amazon.EC2;
using Amazon.EC2.Model;
using Microsoft.AspNetCore.Mvc;

namespace ProjectName.Controllers
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
