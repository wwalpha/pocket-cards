//
//  StudyHomeView.swift
//  VIPERDemo
//
//  Created by macmini on 2021/04/14.
//

import SwiftUI

struct StudyHomeView: View {
    @ObservedObject var presenter: StudyHomePresenter
    
    var body: some View {
        VStack {
            HStack {
                Button(action: {}, label: {
                    self.presenter.registHome(ViewBuilder: {
                        Text("新規登録")
                            .frame(minWidth: 120)
                            .padding()
                            .background(Color.blue)
                            .foregroundColor(.white)
                            .font(.title2)
                            .cornerRadius(10)
                    })
                })
                
                Button(action: /*@START_MENU_TOKEN@*/{}/*@END_MENU_TOKEN@*/, label: {
                    self.presenter.studyCard(ViewBuilder: {
                        Text("テスト")
                            .frame(minWidth: 120)
                            .padding()
                            .background(Color.blue)
                            .foregroundColor(.white)
                            .font(.title2)
                            .cornerRadius(10)
                    })
                })
            }
            .padding(.bottom, 20)
            
            HStack {
                Button(action: /*@START_MENU_TOKEN@*/{}/*@END_MENU_TOKEN@*/, label: {
                    self.presenter.studyCard(ViewBuilder: {
                        Text("学習")
                            .frame(minWidth: 120)
                            .padding()
                            .background(Color.blue)
                            .foregroundColor(.white)
                            .font(.title2)
                            .cornerRadius(10)
                    })
                })
                
                Button(action: /*@START_MENU_TOKEN@*/{}/*@END_MENU_TOKEN@*/, label: {
                    self.presenter.studyCard(ViewBuilder: {
                        Text("復習")
                            .frame(minWidth: 120)
                            .padding()
                            .background(Color.blue)
                            .foregroundColor(.white)
                            .font(.title2)
                            .cornerRadius(10)
                    })
                })
            }
            
            Spacer()
        }
        .navigationBarTitle("Study Home", displayMode: .inline)
        .padding(.vertical, 20)
    }
}

struct StudyHomeView_Previews: PreviewProvider {
    static var previews: some View {
        let presenter = StudyHomePresenter()
        
        StudyHomeView(presenter: presenter)
    }
}
