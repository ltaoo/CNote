# 命令行 Foundation 项目




## 新建项目

首先是创建项目。先新建一个空文件夹，打开 Xcode，新建项目，选择 macOs -> Command Line Tool，一直下一步直到选择文件夹保存项目，选择之前新建的即可。

## 新建类
创建新的类，不是先新建 h 文件，再新建 m 文件，而是直接新建 `Cocoa Class` 即可，会同时生成两个文件。
### Employee 类

```
//
//  Employee.h
//  Employee
//
//  Created by ltaoo on 2016/11/19.
//  Copyright © 2016年 ltaoo. All rights reserved.
//
#ifndef Employee_h
#define Employee_h


# import <Cocoa/Cocoa.h>
@interface Employee:NSObject{
    // 声明成员属性
    NSString *firstName;
    NSString *lastName;
    NSDate *birthDate;
    NSDate *dateOfEmployment;
    // 这个表示 manager 数据类型也是 Employee 吗?
    Employee *manager;
    //  c 类型的双浮点数据类型
    double salary;
}


// 定义属性
// nonatomic 表示是否是原子性，见27%，retain 用于指定生成的赋值函数的语义，见27%
@property (nonatomic, retain) NSString *firstName;
@property (nonatomic, retain) NSString *lastName;
@property (nonatomic, retain) NSDate *birthDate;
@property (nonatomic, retain) NSDate *dateOfEmployment;
@property (nonatomic, assign) Employee *manager;
// 这个的数据类型是 NSTimeInterval
@property (nonatomic, readonly) NSTimeInterval age;
@property (nonatomic) double salary;


// 然后是方法
-(id)initWithFirstName:(NSString *)inFirstName
              lastName:(NSString *)inLastName
             birthDate:(NSDate *)inBirthDate;


// 声明了提高薪水的方法，需要传一个参数，这个参数形参是 percentage ,类型是 double
-(void)giveRaise:(double)percentage;
// 奖金方法
-(double)bonus;


@end


// age ，不需要直接和数据成员相对应，是可以计算的，计算属性是只读的，所以是 readonly
// 这是接口文件，m是实现文件
#endif /* Employee_h */
```

```
//
//  Employee.m
//  Employee
//
//  Created by ltaoo on 2016/11/19.
//  Copyright © 2016年 ltaoo. All rights reserved.
//


// #import <Foundation/Foundation.h>
#import "Employee.h"


@implementation Employee
@synthesize firstName;
@synthesize lastName;
@synthesize birthDate;
@synthesize dateOfEmployment;
@synthesize manager;
@synthesize salary;
@dynamic age;


-(void)dealloc {
    [self setFirstName:nil];
    [self setLastName:nil];
    [self setBirthDate:nil];
    [self setDateOfEmployment:nil];
    [self setManager:nil];
    
    [super dealloc];
}




-(id)init {
    if(self = [super init]){
    
    }
    return self;
}
// 新定义的一个初始化方法
-(id)initWithFirstName:(NSString *)inFirstName
              lastName:(NSString *)inLastName
             birthDate:(NSDate *)inBirthDate{
    if(self = [self init]){
        [self setFirstName:inFirstName];
        [self setLastName:inLastName];
        [self setBirthDate:inBirthDate];
    }
    return self;
}


-(NSTimeInterval)age{
    return [birthDate timeIntervalSinceNow];
}
// 提薪方法，改变成员属性
-(void)giveRaise:(double)percentage{
    salary = salary + (salary*percentage);
}


-(double)bonus{
    return salary * .05;
}


@end
```
### Manage 类

```
//
//  Manager.h
//  Employee
//
//  Created by ltaoo on 2016/11/19.
//  Copyright © 2016年 ltaoo. All rights reserved.
//


#ifndef Manager_h
#define Manager_h
#import <Cocoa/Cocoa.h>
#import "Employee.h"


// 声明类时后面接一个类，是表示继承自该类
@interface Manager : Employee {
    // 声明了一个成员属性
    NSMutableArray *reports;
}


@property (nonatomic, retain) NSMutableArray * reports;
// 声明方法
-(void)addReport:(Employee *)inEmployee;


@end


#endif /* Manager_h */
```

```
//
//  Manager.m
//  Employee
//
//  Created by ltaoo on 2016/11/19.
//  Copyright © 2016年 ltaoo. All rights reserved.
//


#import <Foundation/Foundation.h>
#import "Manager.h"


@implementation Manager
@synthesize reports;


-(void)dealloc {
    for(Employee *employee in reports) {
        [employee setManager:nil];
    }
    [self setReports:nil];
    [super dealloc];
}


-(id)init {
    if(self = [super init]) {
        [self setReports:[NSMutableArray array]];
    }
    return self;
}
-(void)addReport:(Employee *)inEmployee {
    [reports addObject:inEmployee];
    [inEmployee setManager:self];
}


-(double)bonus {
    return salary * .10;
}


@end

```

## 使用类
前面都只是在声明类，还没有真正使用，使用类就是实例化类，调用方法这样。
```
//
//  main.m
//  Employee
//
//  Created by ltaoo on 2016/11/19.
//  Copyright © 2016年 ltaoo. All rights reserved.
//


#import <Foundation/Foundation.h>
// 关联员工类和经理类
#import "Employee.h"
#import "Manager.h"


int main(int argc, const char * argv[]) {
    @autoreleasepool {
        // 声明一个用来格式化时间的变量
        NSDateFormatter *dateFormatter = [[NSDateFormatter alloc] init];
        // 确定时间格式
        [dateFormatter setDateFormat:@"yyyy-MM-dd"];
        // 声明一个变量
        Employee *joeBlow = [[Employee alloc] initWithFirstName:@"Joe" lastName:@"Blow" birthDate:[dateFormatter dateFromString:@"1990-12-01"]];
        Employee *janeDoe = [[Employee alloc] initWithFirstName:@"jane" lastName:@"Doe" birthDate:[dateFormatter dateFromString:@"1993-12-01"]];
        
        // 声明一个经理类
        Manager *johnAppleseed = [[Manager alloc] initWithFirstName:@"john" lastName:@"Appleseed" birthDate:[dateFormatter dateFromString:@"1980-01-01"]];
        // 调用 Manager 实例的 addReports 方法
        [johnAppleseed addReport:joeBlow];
        [johnAppleseed addReport:janeDoe];
        
        // 设置属性？
        joeBlow.salary = 50000;
        janeDoe.salary = 75000;
        johnAppleseed.salary = 100000;
        
        // 声明一个可变数组
        NSMutableArray *allEmployee = [[NSMutableArray alloc] init];
        [allEmployee addObject:joeBlow];
        [allEmployee addObject:janeDoe];
        [allEmployee addObject:johnAppleseed];
        
        // 遍历该数组
        for(Employee *employee in allEmployee) {
            // 调用 giveRaise 方法
            [employee giveRaise:.10];
            NSLog(@"Employee %@ %@'s salary is : %.2f with a bonus of: %.2f", employee.firstName, employee.lastName, employee.salary, employee.bonus);
        }
        
        // 释放变量
        [joeBlow release];
        [janeDoe release];
        [johnAppleseed release];
        [dateFormatter release];
    }
    return 0;
}
```

## 需要注意的地方
### 方法定义- 开头的是实例方法，所以只能在实例上面调用，+ 开头的是类方法，需要在类上调用。
而且方法定义时，前面的 （） 表示这个方法返回值类型，如果没有返回值，就是`void`。### 方法调用
```
[Employee giveRaise:10];
```
这么一行代码犯了两个错误，第一是在类上调用了实例方法 giveRaise，第二个是调用方法传入的参数不对，声明方法时指定参数是双浮点类型，而这里传入的是整型。
### 改变成员属性
不同于 javascript ，如果要改变成员属性，是要改变 this 上对应的属性。而 oc 中是可以直接改变，不需要 this 来指向。

### 声明成员属性
类似于 javascript ，在实例化时可以传入参数作为初始化对象的参数绑定到实例上，然后还可以给实例再声明属性值。
上面在初始化一个实例后，使用了
```
joe.salary = 20000;
```
来给 `joe`这个实例化对象赋值。
