//
//  FolderItemView.swift
//  VIPERDemo
//
//  Created by macmini on 2021/04/11.
//

import SwiftUI

struct FolderItemView: View {
    @State var name: String = ""
    @State var description: String = ""
    
    var body: some View {
        Form {
            HStack(alignment: /*@START_MENU_TOKEN@*/.center/*@END_MENU_TOKEN@*/) {
                Text("Name")
                    .font(.title2)
                    .bold()
                
                TextField("Enter folder name", text: $name)
                    .textFieldStyle(RoundedBorderTextFieldStyle())
            }
            
            HStack(alignment: /*@START_MENU_TOKEN@*/.center/*@END_MENU_TOKEN@*/) {
                Text("Description")
                    .font(.title2)
                    .bold()
                
                TextField("Enter description", text: $description)
                    .textFieldStyle(RoundedBorderTextFieldStyle())
            }

            Button(action: {
                print("Delete tapped!")
            }) {
                HStack {
                    Image(systemName: "trash")
                        .font(.title)
                    Text("Create")
                        .fontWeight(.semibold)
                        .font(.title)
                }
                .frame(minWidth: 0, maxWidth: .infinity)
                .padding()
                .foregroundColor(.white)
                .background(LinearGradient(gradient: Gradient(colors: [Color("DarkGreen"), Color("LightGreen")]), startPoint: .leading, endPoint: .trailing))
                .cornerRadius(40)
            }.padding(.top, 20)
        }
        .navigationTitle("Create Folder")
        
    }
}

struct FolderItemView_Previews: PreviewProvider {
    static var previews: some View {
        FolderItemView()
    }
}
