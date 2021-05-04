//
//  StudyRegistHome.swift
//  VIPERDemo
//
//  Created by macmini on 2021/04/14.
//

import SwiftUI

struct StudyRegistHomeView: View {
    var body: some View {
        VStack {
            Button(action: /*@START_MENU_TOKEN@*/{}/*@END_MENU_TOKEN@*/, label: {
                HStack {
                    Image(systemName: "camera")
                        .font(/*@START_MENU_TOKEN@*/.title/*@END_MENU_TOKEN@*/)
                    
                    Text("Take Photo")
                        .font(/*@START_MENU_TOKEN@*/.title/*@END_MENU_TOKEN@*/)
                }
                .padding()
                .frame(minWidth: 200)
                .foregroundColor(.white)
                .background(Color.blue)
                .cornerRadius(10)
            }).padding(.bottom, 20)
            
            Button(action: /*@START_MENU_TOKEN@*/{}/*@END_MENU_TOKEN@*/, label: {
                HStack {
                    Image(systemName: "square.and.arrow.up")
                        .font(.title)
                    
                    Text("Upload Photo")
                        .font(/*@START_MENU_TOKEN@*/.title/*@END_MENU_TOKEN@*/)
                }
                .padding()
                .frame(minWidth: 200)
                .foregroundColor(.white)
                .background(Color.blue)
                .cornerRadius(10)
            })
            
            Spacer()
        }
        .padding(.top, 40)

    }
}

struct StudyRegistHome_Previews: PreviewProvider {
    static var previews: some View {
        StudyRegistHomeView()
    }
}
